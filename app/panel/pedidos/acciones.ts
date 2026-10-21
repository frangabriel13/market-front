"use server";

import { refresh } from "next/cache";
import { errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { pedidoEstadoSchema, type EstadoPedido } from "@/lib/schemas/pedidos";

export async function cambiarEstadoPedido(
  id: string,
  estado: EstadoPedido,
): Promise<ErrorAccion | undefined> {
  const datos = pedidoEstadoSchema.safeParse({ estado });
  if (!datos.success) return { error: "Dato inválido." };

  try {
    await apiFetchConSesion(`panel/pedidos/${encodeURIComponent(id)}/estado`, {
      method: "PATCH",
      body: datos.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
