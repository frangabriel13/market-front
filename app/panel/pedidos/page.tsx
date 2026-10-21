import type { Metadata } from "next";
import { Suspense } from "react";
import { BotonSalir } from "@/components/boton-salir";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { formatearCuando } from "@/lib/formato";
import type { PedidoResumen } from "@/lib/schemas/pedidos";
import { EncabezadoPagina } from "../encabezado-pagina";
import { NavInferior } from "../nav-inferior";
import { ListaPedidos } from "./lista-pedidos";

export const metadata: Metadata = {
  title: "Pedidos",
};

export default function PedidosPage() {
  return (
    <>
      <EncabezadoPagina titulo="Pedidos" accion={<BotonSalir />} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-24">
        <Suspense fallback={<ListaPedidosCargando />}>
          <Pedidos />
        </Suspense>
      </div>
      <NavInferior actual="pedidos" />
    </>
  );
}

async function Pedidos() {
  const pedidos = await apiFetchConSesion<PedidoResumen[]>("panel/pedidos");
  const ahora = new Date();
  return (
    <ListaPedidos
      pedidos={pedidos.map((pedido) => ({
        ...pedido,
        cuando: formatearCuando(pedido.creadoEn, ahora),
      }))}
    />
  );
}

function ListaPedidosCargando() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-12 w-56 rounded-none" />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-none bg-background" />
      ))}
    </div>
  );
}
