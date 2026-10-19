import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Páginas de texto de la tienda: el título se ve enseguida y el contenido,
// que depende de la marca, llega después.
export function PaginaTexto({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-6">
      <h1 className="mb-6 text-xl font-bold tracking-wide uppercase">{titulo}</h1>
      <Suspense fallback={<TextoCargando />}>{children}</Suspense>
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
    <section className="border-b py-4 first-of-type:pt-0 last-of-type:border-b-0">
      {titulo && <h2 className="mb-2 text-sm font-bold uppercase">{titulo}</h2>}
      <div className="text-sm whitespace-pre-line">{children}</div>
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
