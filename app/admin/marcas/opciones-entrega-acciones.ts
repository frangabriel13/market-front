"use server";

import { refresh } from "next/cache";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  opcionEntregaCrearSchema,
  opcionEntregaEditarSchema,
  type OpcionEntregaCrearInput,
  type OpcionEntregaEditar,
} from "@/lib/schemas/opciones-entrega";
import { DATOS_INVALIDOS, errorDeApi, type ErrorAccion } from "../errores";

function ruta(marcaId: string, opcionId?: string): string {
  const base = `admin/marcas/${encodeURIComponent(marcaId)}/opciones-entrega`;
  return opcionId ? `${base}/${encodeURIComponent(opcionId)}` : base;
}

export async function crearOpcion(
  marcaId: string,
  datos: OpcionEntregaCrearInput,
): Promise<ErrorAccion | undefined> {
  const opcion = opcionEntregaCrearSchema.safeParse(datos);
  if (!opcion.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(ruta(marcaId), { method: "POST", body: opcion.data });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}

export async function editarOpcion(
  marcaId: string,
  opcionId: string,
  datos: OpcionEntregaEditar,
): Promise<ErrorAccion | undefined> {
  const opcion = opcionEntregaEditarSchema.safeParse(datos);
  if (!opcion.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(ruta(marcaId, opcionId), {
      method: "PATCH",
      body: opcion.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}

// Guarda el orden de la lista: cada opción toma su posición.
export async function ordenarOpciones(
  marcaId: string,
  ids: string[],
): Promise<ErrorAccion | undefined> {
  try {
    await Promise.all(
      ids.map((id, orden) =>
        apiFetchConSesion(ruta(marcaId, id), {
          method: "PATCH",
          body: { orden },
        }),
      ),
    );
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
