"use client";

import Link from "next/link";
import { useState } from "react";
import { formatearPrecio } from "@/lib/formato";
import type { PedidoResumen } from "@/lib/schemas/pedidos";
import { cn } from "@/lib/utils";
import { EstadoPedidoEtiqueta } from "./estado-pedido";
import { numeroDePedido } from "./numero";

// `cuando` viene armado del servidor ("Hoy, 10:42").
type Tarjeta = PedidoResumen & { cuando: string };

export function ListaPedidos({ pedidos }: { pedidos: Tarjeta[] }) {
  const nuevos = pedidos.filter((pedido) => pedido.estado === "NUEVO");
  const [soloNuevos, setSoloNuevos] = useState(nuevos.length > 0);

  if (pedidos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no recibiste pedidos.
      </p>
    );
  }

  const visibles = soloNuevos ? nuevos : pedidos;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2" role="group" aria-label="Mostrar">
        <Filtro activo={soloNuevos} onClick={() => setSoloNuevos(true)}>
          Nuevos ({nuevos.length})
        </Filtro>
        <Filtro activo={!soloNuevos} onClick={() => setSoloNuevos(false)}>
          Todos ({pedidos.length})
        </Filtro>
      </div>
      {visibles.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No tenés pedidos nuevos.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visibles.map((pedido) => (
            <li key={pedido.id}>
              <TarjetaPedido pedido={pedido} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Filtro({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={cn(
        "h-12 border px-5 text-sm font-bold",
        activo
          ? "border-foreground bg-foreground text-background"
          : "border-input bg-background",
      )}
    >
      {children}
    </button>
  );
}

function TarjetaPedido({ pedido }: { pedido: Tarjeta }) {
  const nuevo = pedido.estado === "NUEVO";
  return (
    <article
      className={cn(
        "flex flex-col gap-1 bg-background p-4",
        nuevo ? "border-2 border-foreground" : "border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold">
          Pedido {numeroDePedido(pedido.numero)}
        </h2>
        <EstadoPedidoEtiqueta estado={pedido.estado} />
      </div>
      <p className="text-sm text-muted-foreground">{pedido.cuando}</p>
      <p className="truncate">{pedido.compradorNombre}</p>
      <p className="font-bold">{formatearPrecio(pedido.total)}</p>
      <p className="text-sm text-muted-foreground">{pedido.entrega}</p>
      <Link
        href={`/panel/pedidos/${pedido.id}`}
        className="mt-2 self-start text-sm font-bold underline underline-offset-4"
      >
        Ver detalle
      </Link>
    </article>
  );
}
