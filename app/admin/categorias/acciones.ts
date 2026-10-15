"use server";

import { refresh } from "next/cache";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  categoriaCrearSchema,
  categoriaEditarSchema,
  type CategoriaCrearInput,
  type CategoriaEditarInput,
} from "@/lib/schemas/categorias";
import { DATOS_INVALIDOS, errorDeApi, type ErrorAccion } from "../errores";

const NOMBRE_EN_USO = {
  campo: "nombre",
  mensaje: "Ya existe una categoría con ese nombre",
};

function ruta(id?: string): string {
  return id ? `admin/categorias/${encodeURIComponent(id)}` : "admin/categorias";
}

export async function crearCategoria(
  datos: CategoriaCrearInput,
): Promise<ErrorAccion | undefined> {
  const categoria = categoriaCrearSchema.safeParse(datos);
  if (!categoria.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(ruta(), { method: "POST", body: categoria.data });
  } catch (error) {
    return errorDeApi(error, NOMBRE_EN_USO);
  }
  refresh();
}

export async function editarCategoria(
  id: string,
  datos: CategoriaEditarInput,
): Promise<ErrorAccion | undefined> {
  const categoria = categoriaEditarSchema.safeParse(datos);
  if (!categoria.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(ruta(id), { method: "PATCH", body: categoria.data });
  } catch (error) {
    return errorDeApi(error, NOMBRE_EN_USO);
  }
  refresh();
}

export async function eliminarCategoria(
  id: string,
): Promise<ErrorAccion | undefined> {
  try {
    await apiFetchConSesion(ruta(id), { method: "DELETE" });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}

// Guarda el orden entre hermanas: cada una toma su posición.
export async function ordenarCategorias(
  ids: string[],
): Promise<ErrorAccion | undefined> {
  try {
    await Promise.all(
      ids.map((id, orden) =>
        apiFetchConSesion(ruta(id), { method: "PATCH", body: { orden } }),
      ),
    );
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
