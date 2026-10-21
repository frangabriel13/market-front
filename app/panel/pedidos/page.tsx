import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { formatearFechaHora, formatearPrecio } from "@/lib/formato";
import type { PedidoResumen } from "@/lib/schemas/pedidos";
import { EstadoPedidoEtiqueta } from "./estado-pedido";

export const metadata: Metadata = {
  title: "Pedidos",
};

export default function PedidosPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">Pedidos</h1>
      <Suspense fallback={<ListaPedidosCargando />}>
        <ListaPedidos />
      </Suspense>
    </>
  );
}

async function ListaPedidos() {
  const pedidos = await apiFetchConSesion<PedidoResumen[]>("panel/pedidos");

  if (pedidos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Todavía no recibiste pedidos.
      </p>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted-foreground">
        {pedidos.length === 1 ? "1 pedido" : `${pedidos.length} pedidos`}
      </p>
      <ul className="divide-y border-y">
        {pedidos.map((pedido) => (
          <li key={pedido.id}>
            <Link
              href={`/panel/pedidos/${pedido.id}`}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  #{pedido.numero} · {pedido.compradorNombre}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {formatearFechaHora(pedido.creadoEn)} · {pedido.entrega}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="font-bold">{formatearPrecio(pedido.total)}</p>
                <EstadoPedidoEtiqueta estado={pedido.estado} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function ListaPedidosCargando() {
  return (
    <ul className="divide-y border-y" aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <li key={i} className="flex items-center justify-between gap-3 py-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}
