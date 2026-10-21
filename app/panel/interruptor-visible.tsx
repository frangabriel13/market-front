"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { cambiarVisibilidad } from "./acciones";

type Props = { productoId: string; nombre: string; visible: boolean };

// Cambia en el momento y se guarda de fondo; si falla, vuelve atrás.
export function InterruptorVisible({ productoId, nombre, visible }: Props) {
  const [, startTransition] = useTransition();
  const [visibleOptimista, setVisibleOptimista] = useOptimistic(visible);
  const [error, setError] = useState<string>();

  function cambiar(nuevo: boolean) {
    setError(undefined);
    startTransition(async () => {
      setVisibleOptimista(nuevo);
      const resultado = await cambiarVisibilidad(productoId, nuevo);
      if (resultado) setError(resultado.error);
    });
  }

  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-2">
      <Switch
        checked={visibleOptimista}
        onCheckedChange={cambiar}
        aria-label={`Publicar ${nombre}`}
        className="scale-150 data-checked:bg-success"
      />
      {error && (
        <p role="alert" className="text-center text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
