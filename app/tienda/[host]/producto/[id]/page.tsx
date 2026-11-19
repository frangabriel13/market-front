import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatearPrecio } from "@/lib/formato";
import { SIN_VALOR } from "@/lib/schemas/productos";
import { obtenerProducto } from "../../datos";
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

const COLUMNAS = "md:grid md:grid-cols-2 md:gap-10 md:px-4 md:pt-6";

async function DetalleProducto({ params }: Pick<Props, "params">) {
  const { host, id } = await params;
  const producto = await obtenerProducto(host, id);
  const conGuia =
    producto.guiaTallesUrl !== null &&
    producto.variantes.some((v) => v.talle !== SIN_VALOR);
  return (
    <article className="mx-auto w-full max-w-5xl">
      <div className={COLUMNAS}>
        <GaleriaFotos fotos={producto.fotos} nombre={producto.nombre} />
        <div className="flex flex-col gap-6 px-4 pt-4 md:px-0 md:pt-0">
          <div className="flex flex-col gap-1.5">
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
            <h1 className="titulo">{producto.nombre}</h1>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-2xl font-extrabold">
                {formatearPrecio(producto.precio)}
              </span>
              <span className="text-sm text-muted-foreground">por unidad</span>
              {producto.agotado && <Badge className="ml-1">Agotado</Badge>}
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
              guia={
                conGuia && producto.guiaTallesUrl ? (
                  <GuiaTalles url={producto.guiaTallesUrl} />
                ) : null
              }
            />
          )}
          {producto.descripcion && (
            <section className="flex flex-col gap-2 border-t pt-5">
              <h2 className="titulo-seccion">Descripción</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                {producto.descripcion}
              </p>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductoCargando() {
  return (
    <div className="mx-auto w-full max-w-5xl" aria-busy="true">
      <div className={COLUMNAS}>
        <Skeleton className="aspect-[3/4]" />
        <div className="flex flex-col gap-2 px-4 pt-4 md:px-0 md:pt-0">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>
    </div>
  );
}
