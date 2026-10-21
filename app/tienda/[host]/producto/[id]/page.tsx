import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import { obtenerMarca, obtenerProducto } from "../../datos";
import { rutaCategoria } from "../../rutas";
import { ElegirVariante } from "./elegir-variante";
import { GaleriaFotos } from "./galeria-fotos";

type Props = PageProps<"/tienda/[host]/producto/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host, id } = await params;
  return { title: (await obtenerProducto(host, id)).nombre };
}

export default function ProductoPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductoCargando />}>
      <DetalleProducto params={params} />
    </Suspense>
  );
}

const COLUMNAS = "mx-auto w-full max-w-5xl md:grid md:grid-cols-2 md:gap-8 md:px-4 md:pt-6";

async function DetalleProducto({ params }: Pick<Props, "params">) {
  const { host, id } = await params;
  const [producto, marca] = await Promise.all([
    obtenerProducto(host, id),
    obtenerMarca(host),
  ]);
  return (
    <article className={COLUMNAS}>
      <GaleriaFotos fotos={producto.fotos} nombre={producto.nombre} />
      <div className="flex flex-col gap-6 px-4 pt-4 md:px-0 md:pt-0">
        <div>
          <Link
            href={rutaCategoria(producto.categoria.slug)}
            className="text-xs tracking-wide text-muted-foreground uppercase hover:text-foreground"
          >
            {producto.categoria.nombre}
          </Link>
          <h1 className="mt-1 text-lg leading-snug">{producto.nombre}</h1>
          <p className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold">
              {formatearPrecio(producto.precio)}
            </span>
            {producto.agotado && (
              <span className="bg-foreground px-2 py-0.5 text-xs font-bold tracking-wide text-background uppercase">
                Agotado
              </span>
            )}
          </p>
        </div>
        {producto.variantes.length > 0 && (
          <ElegirVariante
            producto={{
              productoId: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              miniatura: producto.fotos[0]?.urlMiniatura ?? null,
            }}
            variantes={producto.variantes}
            guiaTallesUrl={marca.guiaTallesUrl}
          />
        )}
        {producto.descripcion && (
          <section className="border-t pt-4">
            <h2 className="mb-2 text-sm font-bold uppercase">Descripción</h2>
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {producto.descripcion}
            </p>
          </section>
        )}
      </div>
    </article>
  );
}

function ProductoCargando() {
  return (
    <div className={COLUMNAS} aria-busy="true">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="flex flex-col gap-2 px-4 pt-4 md:px-0 md:pt-0">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1 h-7 w-28" />
      </div>
    </div>
  );
}
