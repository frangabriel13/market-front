"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">
        No pudimos cargar los datos. Revisá tu conexión y probá de nuevo.
      </p>
      <Button variant="outline" onClick={retry}>
        Reintentar
      </Button>
    </div>
  );
}
