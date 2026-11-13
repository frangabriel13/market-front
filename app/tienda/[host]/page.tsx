import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CirculosCategorias,
  CirculosCategoriasCargando,
} from "./circulos-categorias";
import { obtenerDestacados, obtenerMarca } from "./datos";
import { GrillaProductos, GrillaProductosCargando } from "./grilla-productos";
import { RUTA_PRODUCTOS } from "./rutas";

type Params = { params: Promise<{ host: string }> };

export default function InicioTiendaPage({ params }: PageProps<"/tienda/[host]">) {
  return (
    <>
      <Suspense fallback={<Skeleton className="aspect-[5/2] rounded-none" />}>
        <Portada params={params} />
      </Suspense>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-5">
        <Suspense fallback={<CirculosCategoriasCargando />}>
          <Categorias params={params} />
        </Suspense>
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[15px] font-extrabold tracking-wider uppercase">
              Novedades
            </h2>
            <Link
              href={RUTA_PRODUCTOS}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Ver todo
            </Link>
          </div>
          <Suspense fallback={<GrillaProductosCargando />}>
            <Novedades params={params} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

// La portada se muestra entera, con su proporción, sin textos encima: los
// textos del banner dejaron de mostrarse (decidido el 13/11, en la 7.1).
async function Portada({ params }: Params) {
  const marca = await obtenerMarca((await params).host);
  return (
    <>
      <h1 className="sr-only">{marca.nombre}</h1>
      {marca.portadaUrl && (
        <Image
          src={marca.portadaUrl}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          priority
          className="h-auto w-full"
        />
      )}
    </>
  );
}

async function Categorias({ params }: Params) {
  return <CirculosCategorias host={(await params).host} />;
}

// Los 8 visibles más nuevos.
async function Novedades({ params }: Params) {
  const productos = await obtenerDestacados((await params).host);
  if (productos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no hay productos.
      </p>
    );
  }
  return <GrillaProductos productos={productos} />;
}
