"use client";

import { ErrorCarga } from "@/components/error-carga";

// Si falla el layout de la tienda (encabezado, pie o metadatos).
export default function TiendaLayoutError({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col justify-center px-4">
      <ErrorCarga retry={retry} />
    </main>
  );
}
