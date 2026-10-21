"use server";

import { headers } from "next/headers";
import { DATOS_INVALIDOS, errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { ApiError } from "@/lib/api/server";
import { tiendaFetch } from "@/lib/api/tienda";
import {
  pedidoCrearSchema,
  type PedidoCrearInput,
  type PedidoCreado,
  type PedidoNoDisponible,
} from "@/lib/schemas/pedidos";

export type ResultadoPedido =
  | { pedido: PedidoCreado }
  | (ErrorAccion & { noDisponibles?: PedidoNoDisponible["noDisponibles"] });

export async function crearPedido(datos: PedidoCrearInput): Promise<ResultadoPedido> {
  const pedido = pedidoCrearSchema.safeParse(datos);
  if (!pedido.success) return DATOS_INVALIDOS;

  // La Server Action llega al host de la tienda; la IP es para el límite de pedidos.
  const entrantes = await headers();
  const ip = entrantes.get("x-forwarded-for");
  try {
    const creado = await tiendaFetch<PedidoCreado>(
      entrantes.get("host") ?? "",
      "tienda/pedidos",
      {
        method: "POST",
        body: pedido.data,
        headers: ip ? { "x-forwarded-for": ip } : undefined,
      },
    );
    return { pedido: creado };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status >= 500) {
      return { error: "No pudimos armar el pedido. Probá de nuevo." };
    }
    if (error.status === 409) {
      const { noDisponibles } = error.cuerpo as PedidoNoDisponible;
      return { error: error.message, noDisponibles };
    }
    return errorDeApi(error);
  }
}
