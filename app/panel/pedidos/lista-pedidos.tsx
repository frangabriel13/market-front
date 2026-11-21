"use client";

import { ChevronRight, ReceiptText } from "lucide-react";
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
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <ReceiptText
          className="size-10 text-muted-foreground"
          strokeWidth={1.5}
        />
        <p className="titulo-seccion">Todavía no recibiste pedidos</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Cuando alguien arme un pedido en tu tienda, aparece acá aunque no te
          haya escrito por WhatsApp.
        </p>
      </div>
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
        <p className="py-12 text-center text-sm text-muted-foreground">
          No tenés pedidos nuevos.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
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
        "h-10 border px-4 text-sm font-semibold transition-colors",
        activo
          ? "border-foreground bg-foreground text-background"
          : "border-input bg-background hover:border-foreground",
      )}
    >
      {children}
    </button>
  );
}

function TarjetaPedido({ pedido }: { pedido: Tarjeta }) {
  const nuevo = pedido.estado === "NUEVO";
  // Toda la tarjeta lleva al detalle; los nuevos, con una raya a la izquierda.
  return (
    <Link
      href={`/panel/pedidos/${pedido.id}`}
      className={cn(
        "flex items-center gap-3 border bg-background p-4 transition-colors hover:border-foreground/30",
        nuevo && "border-l-4 border-l-foreground",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">Pedido {numeroDePedido(pedido.numero)}</h2>
          <EstadoPedidoEtiqueta estado={pedido.estado} />
        </div>
        <p className="truncate text-sm">{pedido.compradorNombre}</p>
        <p className="text-sm">
          <span className="font-bold">{formatearPrecio(pedido.total)}</span>
          <span className="text-muted-foreground">
            {" "}
            · {pedido.unidades} {pedido.unidades === 1 ? "unidad" : "unidades"}
          </span>
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {[pedido.cuando, pedido.entrega, pedido.localidad]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
