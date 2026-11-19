import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Migas } from "./migas";

// Páginas de texto de la tienda: el título se ve enseguida y el contenido,
// que depende de la marca, llega después.
// `ruta`: la de esta página, para las migas.
export function PaginaTexto({
  titulo,
  ruta,
  children,
}: {
  titulo: string;
  ruta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="contenedor pt-4 md:pt-6">
      <div className="flex max-w-2xl flex-col gap-1.5">
        <Migas
          migas={[
            { href: "/", texto: "Inicio" },
            { href: ruta, texto: titulo },
          ]}
        />
        <h1 className="titulo mb-5 md:mb-7">{titulo}</h1>
        <Suspense fallback={<TextoCargando />}>{children}</Suspense>
      </div>
    </div>
  );
}

export function Seccion({
  titulo,
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b py-5 first-of-type:pt-0 last-of-type:border-b-0">
      {titulo && <h2 className="titulo-seccion mb-2.5">{titulo}</h2>}
      <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/85">
        {children}
      </div>
    </section>
  );
}

function TextoCargando() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
