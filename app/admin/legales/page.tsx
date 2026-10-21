import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { TextoLegal } from "@/lib/schemas/legales";
import { TextoLegalForm } from "./texto-legal-form";

export const metadata: Metadata = {
  title: "Textos legales",
};

export default function LegalesPage() {
  return (
    <>
      <h1 className="text-2xl font-black">Textos legales</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Son los mismos para todas las tiendas. Aparecen en el pie de cada una.
      </p>
      <Suspense fallback={<LegalesCargando />}>
        <Legales />
      </Suspense>
    </>
  );
}

async function Legales() {
  const textos = await apiFetchConSesion<TextoLegal[]>("admin/legales");
  return (
    <div className="flex flex-col gap-10">
      {textos.map((texto) => (
        <TextoLegalForm key={texto.tipo} texto={texto} />
      ))}
    </div>
  );
}

function LegalesCargando() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-60 w-full" />
    </div>
  );
}
