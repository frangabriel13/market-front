"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  ESTADOS_PEDIDO,
  ETIQUETAS_ESTADO_PEDIDO,
  type EstadoPedido,
} from "@/lib/schemas/pedidos";
import { cn } from "@/lib/utils";
import { cambiarEstadoPedido } from "./acciones";

type Props = { pedidoId: string; estado: EstadoPedido };

// TODO(decision): cualquier estado puede pasar a cualquier otro.
// Cambia en el momento y se guarda de fondo; si falla, vuelve atrás.
export function CambiarEstado({ pedidoId, estado }: Props) {
  const [, startTransition] = useTransition();
  const [estadoOptimista, setEstadoOptimista] = useOptimistic(estado);
  const [error, setError] = useState<string>();

  function cambiar(nuevo: EstadoPedido) {
    setError(undefined);
    startTransition(async () => {
      setEstadoOptimista(nuevo);
      const resultado = await cambiarEstadoPedido(pedidoId, nuevo);
      if (resultado) setError(resultado.error);
    });
  }

  return (
    <fieldset>
      <legend className="titulo-seccion mb-3">Estado</legend>
      <div className="flex flex-wrap gap-2">
        {ESTADOS_PEDIDO.map((opcion) => (
          <button
            key={opcion}
            type="button"
            aria-pressed={opcion === estadoOptimista}
            onClick={() => opcion !== estadoOptimista && cambiar(opcion)}
            className={cn(
              "h-10 border px-3.5 text-sm font-semibold transition-colors",
              opcion === estadoOptimista
                ? "border-foreground bg-foreground text-background"
                : "border-input hover:border-foreground",
            )}
          >
            {ETIQUETAS_ESTADO_PEDIDO[opcion]}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
