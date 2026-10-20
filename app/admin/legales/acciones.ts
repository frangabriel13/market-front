"use server";

import { refresh } from "next/cache";
import {
  DATOS_INVALIDOS,
  errorDeApi,
  type ErrorAccion,
} from "@/lib/acciones/errores";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  textoLegalEditarSchema,
  tipoTextoLegalSchema,
  type TextoLegalEditar,
  type TipoTextoLegal,
} from "@/lib/schemas/legales";

export async function guardarTextoLegal(
  tipo: TipoTextoLegal,
  datos: TextoLegalEditar,
): Promise<ErrorAccion | undefined> {
  const texto = textoLegalEditarSchema.safeParse(datos);
  if (!tipoTextoLegalSchema.safeParse(tipo).success || !texto.success) {
    return DATOS_INVALIDOS;
  }

  try {
    await apiFetchConSesion(`admin/legales/${tipo}`, {
      method: "PUT",
      body: texto.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
