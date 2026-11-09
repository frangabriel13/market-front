"use server";

import { refresh } from "next/cache";
import { errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  archivoImagenSchema,
  type ArchivoImagen,
  type UrlDeSubida,
} from "@/lib/schemas/imagenes";
import {
  coloresSchema,
  listaTallesCrearSchema,
  listaTallesEditarSchema,
  type ListaTallesCrearInput,
  type ListaTallesEditarInput,
  type ValorEditado,
} from "@/lib/schemas/listas";

const rutaLista = (id: string, resto = "") =>
  `panel/listas-talles/${encodeURIComponent(id)}${resto}`;

const invalido = (issues: { message: string }[]): ErrorAccion => ({
  error: issues[0]?.message ?? "Datos inválidos.",
});

async function guardar(
  ruta: string,
  init: Parameters<typeof apiFetchConSesion>[1],
  conflicto?: Parameters<typeof errorDeApi>[1],
): Promise<ErrorAccion | undefined> {
  try {
    await apiFetchConSesion(ruta, init);
  } catch (error) {
    return errorDeApi(error, conflicto);
  }
  refresh();
}

export async function guardarColores(colores: ValorEditado[]) {
  const datos = coloresSchema.safeParse({ colores });
  if (!datos.success) return invalido(datos.error.issues);
  return guardar("panel/colores", { method: "PUT", body: datos.data });
}

export async function crearListaTalles(lista: ListaTallesCrearInput) {
  const datos = listaTallesCrearSchema.safeParse(lista);
  if (!datos.success) return invalido(datos.error.issues);
  return guardar(
    "panel/listas-talles",
    { method: "POST", body: datos.data },
    { campo: "nombre" },
  );
}

export async function editarListaTalles(
  id: string,
  lista: ListaTallesEditarInput,
) {
  const datos = listaTallesEditarSchema.safeParse(lista);
  if (!datos.success) return invalido(datos.error.issues);
  return guardar(rutaLista(id), { method: "PATCH", body: datos.data });
}

export async function eliminarListaTalles(id: string) {
  return guardar(rutaLista(id), { method: "DELETE" });
}

export async function pedirUrlDeGuia(
  id: string,
  archivo: ArchivoImagen,
): Promise<{ subida: UrlDeSubida } | ErrorAccion> {
  const datos = archivoImagenSchema.safeParse(archivo);
  if (!datos.success) return invalido(datos.error.issues);

  try {
    const subida = await apiFetchConSesion<UrlDeSubida>(
      rutaLista(id, "/guia"),
      { method: "POST", body: datos.data },
    );
    return { subida };
  } catch (error) {
    // 503: el almacenamiento no está configurado en la API; el mensaje lo explica.
    if (error instanceof ApiError && error.status === 503) {
      return { error: error.message };
    }
    return errorDeApi(error);
  }
}
