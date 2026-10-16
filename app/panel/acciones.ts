"use server";

import { refresh } from "next/cache";
import { errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import { productoVisibilidadSchema } from "@/lib/schemas/productos";

export async function cambiarVisibilidad(
  id: string,
  visible: boolean,
): Promise<ErrorAccion | undefined> {
  const datos = productoVisibilidadSchema.safeParse({ visible });
  if (!datos.success) return { error: "Dato inválido." };

  try {
    await apiFetchConSesion(
      `panel/productos/${encodeURIComponent(id)}/visibilidad`,
      { method: "PATCH", body: datos.data },
    );
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
