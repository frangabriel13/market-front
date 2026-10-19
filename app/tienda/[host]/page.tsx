import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerDestacados, obtenerMarca } from "./datos";
import { GrillaProductos, GrillaProductosCargando } from "./grilla-productos";

type Params = { params: Promise<{ host: string }> };

export default function InicioTiendaPage({ params }: PageProps<"/tienda/[host]">) {
  return (
    <>
      <Suspense fallback={<Skeleton className="aspect-video rounded-none" />}>
        <Portada params={params} />
      </Suspense>
      <section className="mx-auto w-full max-w-5xl px-4 pt-8">
        <h2 className="mb-4 text-center text-lg font-bold tracking-widest uppercase">
          Destacados
        </h2>
        <Suspense fallback={<GrillaProductosCargando />}>
          <Destacados params={params} />
        </Suspense>
      </section>
    </>
  );
}

async function Portada({ params }: Params) {
  const marca = await obtenerMarca((await params).host);
  return (
    <section>
      <h1 className="sr-only">{marca.nombre}</h1>
      {marca.portadaUrl && (
        <div className="relative aspect-video bg-muted">
          <Image
            src={marca.portadaUrl}
            alt=""
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
      )}
      {marca.textosBanner.length > 0 && (
        <ul className="flex flex-col gap-1 bg-foreground px-4 py-3 text-center text-xs font-bold tracking-wide text-background uppercase">
          {marca.textosBanner.map((texto, i) => (
            <li key={i}>{texto}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function Destacados({ params }: Params) {
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
