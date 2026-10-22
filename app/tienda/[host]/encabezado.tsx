import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import type { MarcaTienda } from "@/lib/schemas/tienda";
import { ControlDerecho, ControlIzquierdo } from "./controles-encabezado";
import { obtenerCategorias, obtenerMarca } from "./datos";

const FILA =
  "grid h-14 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-foreground px-2 text-background";

export async function Encabezado({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const [marca, categorias] = await Promise.all([
    obtenerMarca(host),
    obtenerCategorias(host),
  ]);
  return (
    <header className="sticky top-0 z-40 bg-background">
      <Franja marca={marca} />
      <div className={FILA}>
        <ControlIzquierdo categorias={categorias} />
        <Link href="/" className="justify-self-center">
          <Logo marca={marca} />
        </Link>
        <ControlDerecho />
      </div>
    </header>
  );
}

// Lo que conviene saber antes de comprar: el mínimo y si hay envíos.
function Franja({ marca }: { marca: MarcaTienda }) {
  const avisos = [
    marca.minimoCompra > 0 &&
      `Mínimo de compra ${formatearPrecio(marca.minimoCompra)}`,
    marca.opcionesEntrega.some((o) => o.tipo === "ENVIO") &&
      "Envíos a todo el país",
  ].filter(Boolean);
  if (avisos.length === 0) return null;
  return (
    <p className="bg-destacado px-4 py-2 text-center text-[11px] font-bold tracking-wider text-destacado-foreground uppercase">
      {avisos.join(" · ")}
    </p>
  );
}

function Logo({ marca }: { marca: MarcaTienda }) {
  if (!marca.logoUrl) {
    return (
      <span className="text-xl font-black tracking-wider uppercase italic">
        {marca.nombre}
      </span>
    );
  }
  return (
    <span className="relative block h-9 w-40">
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
    <header aria-busy="true">
      <div className={FILA}>
        <span />
        <Skeleton className="h-6 w-32 justify-self-center bg-white/15" />
      </div>
    </header>
  );
}
