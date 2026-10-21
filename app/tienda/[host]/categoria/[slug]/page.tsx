import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { tituloDe, ubicarCategoria } from "../../categorias";
import { ChipsCategorias } from "../../chips-categorias";
import { obtenerCategorias, obtenerProductos } from "../../datos";
import { GrillaProductos, GrillaProductosCargando } from "../../grilla-productos";
import { Migas } from "../../migas";
import { rutaCategoria } from "../../rutas";

type Props = PageProps<"/tienda/[host]/categoria/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host, slug } = await params;
  const ubicacion = ubicarCategoria(await obtenerCategorias(host), slug);
  return ubicacion ? { title: tituloDe(ubicacion) } : {};
}

export default function CategoriaPage({ params }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4">
      <Suspense fallback={<ListadoCargando />}>
        <Listado params={params} />
      </Suspense>
    </div>
  );
}

async function Listado({ params }: Pick<Props, "params">) {
  const { host, slug } = await params;
  const [categorias, productos] = await Promise.all([
    obtenerCategorias(host),
    obtenerProductos(host, slug),
  ]);
  const ubicacion = ubicarCategoria(categorias, slug);
  if (!ubicacion) notFound();

  const { categoria, subcategoria } = ubicacion;
  // Con subcategorías se elige entre ellas; si no, se salta a otra categoría.
  const chips = categoria.subcategorias.length
    ? [{ slug: categoria.slug, nombre: "Todo" }, ...categoria.subcategorias]
    : categorias;

  return (
    <div className="flex flex-col gap-4">
      <Migas
        migas={[
          { href: "/", texto: "Inicio" },
          { href: rutaCategoria(categoria.slug), texto: categoria.nombre },
          ...(subcategoria
            ? [{ href: rutaCategoria(subcategoria.slug), texto: subcategoria.nombre }]
            : []),
        ]}
      />
      <h1 className="titulo text-3xl">{(subcategoria ?? categoria).nombre}</h1>
      <ChipsCategorias chips={chips} actual={slug} />
      <GrillaProductos productos={productos} />
    </div>
  );
}

function ListadoCargando() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-48" />
      <GrillaProductosCargando />
    </div>
  );
}
