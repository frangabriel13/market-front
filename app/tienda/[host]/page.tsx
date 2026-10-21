import Image from "next/image";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChipsCategorias } from "./chips-categorias";
import { obtenerCategorias, obtenerDestacados, obtenerMarca } from "./datos";
import { GrillaProductos, GrillaProductosCargando } from "./grilla-productos";

type Params = { params: Promise<{ host: string }> };

const DESTACADOS = "destacados";

export default function InicioTiendaPage({ params }: PageProps<"/tienda/[host]">) {
  return (
    <>
      <Suspense fallback={<Skeleton className="aspect-[5/4] rounded-none" />}>
        <Portada params={params} />
      </Suspense>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-5">
        <Suspense>
          <Categorias params={params} />
        </Suspense>
        <section id={DESTACADOS} className="scroll-mt-32">
          <h2 className="titulo mb-4 text-2xl">Destacados</h2>
          <Suspense fallback={<GrillaProductosCargando />}>
            <Destacados params={params} />
          </Suspense>
        </section>
      </div>
    </>
  );
}

// El primer texto del banner es el título; los demás, la bajada.
async function Portada({ params }: Params) {
  const marca = await obtenerMarca((await params).host);
  const [titulo, ...bajada] = marca.textosBanner;
  if (!marca.portadaUrl && !titulo) {
    return <h1 className="sr-only">{marca.nombre}</h1>;
  }
  const conFoto = Boolean(marca.portadaUrl);
  return (
    <section
      className={cn(
        "relative flex aspect-[5/4] flex-col justify-end px-4 py-6 sm:aspect-[21/9]",
        conFoto ? "text-white" : "bg-[#d9dce1]",
      )}
    >
      {marca.portadaUrl && (
        <>
          <Image
            src={marca.portadaUrl}
            alt=""
            fill
            unoptimized
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </>
      )}
      <div className="relative mx-auto w-full max-w-5xl">
        <h1 className="titulo text-4xl">{titulo ?? marca.nombre}</h1>
        {bajada.map((texto, i) => (
          <p key={i} className="mt-2 text-base">
            {texto}
          </p>
        ))}
        <Button
          asChild
          size="lg"
          className={cn("mt-4", conFoto && "bg-white text-foreground hover:bg-white/90")}
        >
          <a href={`#${DESTACADOS}`}>Ver productos</a>
        </Button>
      </div>
    </section>
  );
}

async function Categorias({ params }: Params) {
  const categorias = await obtenerCategorias((await params).host);
  return <ChipsCategorias chips={categorias} />;
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
