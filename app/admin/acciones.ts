"use server";

import { refresh } from "next/cache";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { marcaEstadoSchema, type EstadoMarca } from "@/lib/schemas/marcas";

export async function cambiarEstadoMarca(
  id: string,
  estado: EstadoMarca,
): Promise<{ error: string } | undefined> {
  const datos = marcaEstadoSchema.safeParse({ estado });
  if (!datos.success) return { error: "Estado inválido." };

  try {
    await apiFetchConSesion(`admin/marcas/${encodeURIComponent(id)}/estado`, {
      method: "PATCH",
      body: datos.data,
    });
  } catch (error) {
    return {
      error:
        error instanceof ApiError && error.status < 500
          ? error.message
          : "No pudimos cambiar el estado. Probá de nuevo.",
    };
  }
  refresh();
}
