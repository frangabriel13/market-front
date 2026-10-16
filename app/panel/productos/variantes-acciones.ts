"use server";

import { refresh } from "next/cache";
import { errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  variantesSchema,
  type VarianteProducto,
} from "@/lib/schemas/productos";

export async function guardarVariantes(
  productoId: string,
  variantes: VarianteProducto[],
): Promise<ErrorAccion | undefined> {
  const datos = variantesSchema.safeParse({ variantes });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await apiFetchConSesion(
      `panel/productos/${encodeURIComponent(productoId)}/variantes`,
      { method: "PUT", body: datos.data },
    );
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
