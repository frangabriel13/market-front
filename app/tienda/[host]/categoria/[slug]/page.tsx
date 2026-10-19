import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { tituloDe, ubicarCategoria, type Ubicacion } from "../../categorias";
import { obtenerCategorias, obtenerProductos } from "../../datos";
import { GrillaProductos, GrillaProductosCargando } from "../../grilla-productos";
import { rutaCategoria } from "../../rutas";

type Props = PageProps<"/tienda/[host]/categoria/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host, slug } = await params;
  const ubicacion = ubicarCategoria(await obtenerCategorias(host), slug);
  return ubicacion ? { title: tituloDe(ubicacion) } : {};
}

export default function CategoriaPage({ params }: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6">
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

  return (
    <>
      <h1 className="text-xl font-bold tracking-wide uppercase">
        {ubicacion.categoria.nombre}
      </h1>
      <Subcategorias {...ubicacion} />
      <p className="mt-4 mb-3 text-sm text-muted-foreground">
        {productos.length === 1 ? "1 producto" : `${productos.length} productos`}
      </p>
      <GrillaProductos productos={productos} />
    </>
  );
}

function Subcategorias({ categoria, subcategoria }: Ubicacion) {
  if (categoria.subcategorias.length === 0) return null;
  const opciones = [
    { slug: categoria.slug, nombre: "Todo" },
    ...categoria.subcategorias,
  ];
  const actual = subcategoria?.slug ?? categoria.slug;
  return (
    <nav
      aria-label="Subcategorías"
      className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none]"
    >
      <ul className="flex gap-2">
        {opciones.map(({ slug, nombre }) => (
          <li key={slug}>
            <Link
              href={rutaCategoria(slug)}
              aria-current={slug === actual ? "page" : undefined}
              className={cn(
                "block border px-3 py-1.5 text-sm whitespace-nowrap",
                slug === actual
                  ? "border-foreground bg-foreground font-bold text-background"
                  : "border-border hover:border-foreground",
              )}
            >
              {nombre}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ListadoCargando() {
  return (
    <>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="mt-4 mb-3 h-4 w-24" />
      <GrillaProductosCargando />
    </>
  );
}
