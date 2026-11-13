import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import type { MarcaTienda } from "@/lib/schemas/tienda";
import { categoriasALaVista } from "./categorias";
import {
  ControlDerecho,
  ControlIzquierdo,
  NavEscritorio,
} from "./controles-encabezado";
import { obtenerCategorias, obtenerMarca } from "./datos";
import { RUTA_PRODUCTOS, rutaCategoria } from "./rutas";

// Celular: menú, marca al centro y pedido. Escritorio: marca a la izquierda,
// categorías al medio y pedido.
const FILA =
  "mx-auto grid h-14 w-full max-w-5xl grid-cols-[2.75rem_1fr_2.75rem] items-center px-2 md:h-16 md:grid-cols-[1fr_auto_1fr] md:px-4";

export async function Encabezado({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const [marca, categorias] = await Promise.all([
    obtenerMarca(host),
    obtenerCategorias(host),
  ]);
  const enlaces = [
    { href: RUTA_PRODUCTOS, texto: "Todo" },
    ...categoriasALaVista(categorias).map((c) => ({
      href: rutaCategoria(c.slug),
      texto: c.nombre,
    })),
  ];
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Franja marca={marca} />
      <div className={FILA}>
        <div className="md:hidden">
          <ControlIzquierdo categorias={categorias} />
        </div>
        <Link
          href="/"
          className="flex min-w-0 items-center justify-center gap-2 md:justify-self-start"
        >
          <Marca marca={marca} />
        </Link>
        <NavEscritorio enlaces={categorias.length > 0 ? enlaces : []} />
        <div className="justify-self-end">
          <ControlDerecho />
        </div>
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
    <p className="bg-foreground px-4 py-2 text-center text-[11px] font-semibold tracking-wider text-background uppercase">
      {avisos.join(" · ")}
    </p>
  );
}

// El logo, si hay, con el nombre al lado.
function Marca({ marca }: { marca: MarcaTienda }) {
  return (
    <>
      {marca.logoUrl && (
        <Image
          src={marca.logoUrl}
          alt=""
          width={0}
          height={0}
          unoptimized
          priority
          className="h-8 w-auto max-w-24 shrink-0 object-contain md:h-9"
        />
      )}
      <span className="truncate text-lg font-extrabold tracking-[0.14em] uppercase md:text-xl">
        {marca.nombre}
      </span>
    </>
  );
}

export function EncabezadoCargando() {
  return (
    <header aria-busy="true" className="border-b">
      <div className={FILA}>
        <span />
        <Skeleton className="h-6 w-32 justify-self-center md:justify-self-start" />
      </div>
    </header>
  );
}
