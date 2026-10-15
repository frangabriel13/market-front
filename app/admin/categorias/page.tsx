import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import { Categorias } from "./categorias";

export const metadata: Metadata = {
  title: "Categorías",
};

export default function CategoriasPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Categorías</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Son las mismas para todas las tiendas. Cada producto va en una sola.
      </p>
      <Suspense fallback={<CategoriasCargando />}>
        <ListaCategorias />
      </Suspense>
    </>
  );
}

async function ListaCategorias() {
  const categorias =
    await apiFetchConSesion<CategoriaConSubcategorias[]>("admin/categorias");
  return <Categorias categorias={categorias} />;
}

function CategoriasCargando() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-5 w-40" />
      ))}
    </div>
  );
}
