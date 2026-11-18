"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Contenido de los error.tsx.
export function ErrorCarga({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="titulo-seccion">No pudimos cargar los datos</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Revisá tu conexión y probá de nuevo.
      </p>
      <Button onClick={retry} className="mt-2">
        <RotateCw />
        Reintentar
      </Button>
    </div>
  );
}
