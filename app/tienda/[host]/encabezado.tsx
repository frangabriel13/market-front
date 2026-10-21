import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarcaTienda } from "@/lib/schemas/tienda";
import { BarraCategorias } from "./barra-categorias";
import { BotonCarrito } from "./boton-carrito";
import { obtenerCategorias, obtenerMarca } from "./datos";
import { MenuCategorias } from "./menu-categorias";

const FILA = "grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center px-2";

export async function Encabezado({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const [marca, categorias] = await Promise.all([
    obtenerMarca(host),
    obtenerCategorias(host),
  ]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className={FILA}>
        {categorias.length > 0 ? (
          <MenuCategorias categorias={categorias} />
        ) : (
          <span />
        )}
        <Link href="/" className="justify-self-center">
          <Logo marca={marca} />
        </Link>
        <BotonCarrito />
      </div>
      {categorias.length > 0 && <BarraCategorias categorias={categorias} />}
    </header>
  );
}

function Logo({ marca }: { marca: MarcaTienda }) {
  if (!marca.logoUrl) {
    return (
      <span className="text-lg font-bold tracking-widest uppercase">
        {marca.nombre}
      </span>
    );
  }
  return (
    <span className="relative block h-10 w-40">
      <Image
        src={marca.logoUrl}
        alt={marca.nombre}
        fill
        unoptimized
        priority
        className="object-contain"
      />
    </span>
  );
}

export function EncabezadoCargando() {
  return (
    <header className="border-b" aria-busy="true">
      <div className={FILA}>
        <span />
        <Skeleton className="h-6 w-32 justify-self-center" />
      </div>
    </header>
  );
}
