import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import { obtenerMarca, obtenerProducto } from "../../datos";
import { Migas } from "../../migas";
import { rutaCategoria, rutaProducto } from "../../rutas";
import { ElegirCantidades } from "./elegir-cantidades";
import { GaleriaFotos } from "./galeria-fotos";
import { GuiaTalles } from "./guia-talles";

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

const COLUMNAS = "md:grid md:grid-cols-2 md:gap-8 md:px-4";

async function DetalleProducto({ params }: Pick<Props, "params">) {
  const { host, id } = await params;
  const [producto, marca] = await Promise.all([
    obtenerProducto(host, id),
    obtenerMarca(host),
  ]);
  return (
    <article className="mx-auto w-full max-w-5xl">
      <div className="px-4 py-3">
        <Migas
          migas={[
            { href: "/", texto: "Inicio" },
            {
              href: rutaCategoria(producto.categoria.slug),
              texto: producto.categoria.nombre,
            },
            { href: rutaProducto(producto.id), texto: producto.nombre },
          ]}
        />
      </div>
      <div className={COLUMNAS}>
        <GaleriaFotos fotos={producto.fotos} nombre={producto.nombre} />
        <div className="flex flex-col gap-6 px-4 pt-5 md:px-0 md:pt-0">
          <div>
            <h1 className="titulo text-3xl">{producto.nombre}</h1>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-black">
                {formatearPrecio(producto.precio)}
              </span>
              <span className="text-muted-foreground">por unidad</span>
              {producto.agotado && (
                <span className="ml-1 self-center bg-foreground px-2 py-0.5 text-xs font-bold tracking-wide text-background uppercase">
                  Agotado
                </span>
              )}
            </p>
          </div>
          {producto.variantes.length > 0 && (
            <ElegirCantidades
              producto={{
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                miniatura: producto.fotos[0]?.urlMiniatura ?? null,
              }}
              variantes={producto.variantes}
            />
          )}
          <div>
            {producto.descripcion && (
              <section className="mb-4">
                <h2 className="border-b-2 border-foreground pb-2 text-sm font-bold tracking-wider uppercase">
                  Descripción
                </h2>
                <p className="pt-3 text-sm whitespace-pre-line">
                  {producto.descripcion}
                </p>
              </section>
            )}
            {marca.guiaTallesUrl && producto.variantes.length > 0 && (
              <GuiaTalles url={marca.guiaTallesUrl} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductoCargando() {
  return (
    <div className="mx-auto w-full max-w-5xl" aria-busy="true">
      <Skeleton className="mx-4 my-3 h-4 w-48" />
      <div className={COLUMNAS}>
        <Skeleton className="aspect-[3/4] rounded-none" />
        <div className="flex flex-col gap-2 px-4 pt-5 md:px-0 md:pt-0">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>
    </div>
  );
}
