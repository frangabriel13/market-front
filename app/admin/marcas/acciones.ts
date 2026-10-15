"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { UrlDeSubida } from "@/lib/schemas/imagenes";
import {
  accesoFabricanteSchema,
  imagenMarcaSchema,
  marcaCrearSchema,
  marcaEditarSchema,
  type AccesoFabricante,
  type AccesoFabricanteInput,
  type ImagenMarca,
  type Marca,
  type MarcaCrearInput,
  type MarcaEditarInput,
} from "@/lib/schemas/marcas";
import { DATOS_INVALIDOS, errorDeApi, type ErrorAccion } from "../errores";

const SLUG_EN_USO = {
  campo: "slug",
  mensaje: "Ya hay una tienda con esa dirección",
};


export async function crearMarca(
  datos: MarcaCrearInput,
): Promise<ErrorAccion> {
  const marca = marcaCrearSchema.safeParse(datos);
  if (!marca.success) return DATOS_INVALIDOS;

  let id: string;
  try {
    ({ id } = await apiFetchConSesion<Marca>("admin/marcas", {
      method: "POST",
      body: marca.data,
    }));
  } catch (error) {
    return errorDeApi(error, SLUG_EN_USO);
  }
  redirect(`/admin/marcas/${id}`);
}

export async function editarMarca(
  id: string,
  datos: MarcaEditarInput,
): Promise<ErrorAccion | undefined> {
  const marca = marcaEditarSchema.safeParse(datos);
  if (!marca.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(`admin/marcas/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: marca.data,
    });
  } catch (error) {
    return errorDeApi(error, SLUG_EN_USO);
  }
  refresh();
}

export async function pedirUrlDeImagen(
  id: string,
  imagen: ImagenMarca,
): Promise<{ subida: UrlDeSubida } | ErrorAccion> {
  const datos = imagenMarcaSchema.safeParse(imagen);
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Imagen inválida." };
  }

  try {
    const subida = await apiFetchConSesion<UrlDeSubida>(
      `admin/marcas/${encodeURIComponent(id)}/imagenes`,
      { method: "POST", body: datos.data },
    );
    return { subida };
  } catch (error) {
    // 503: el almacenamiento de imágenes no está configurado en la API; el mensaje lo explica.
    if (error instanceof ApiError && (error.status < 500 || error.status === 503)) {
      return { error: error.message };
    }
    return { error: "No pudimos preparar la subida. Probá de nuevo." };
  }
}

export async function crearAcceso(
  id: string,
  datos: AccesoFabricanteInput,
): Promise<{ acceso: AccesoFabricante } | ErrorAccion> {
  const acceso = accesoFabricanteSchema.safeParse(datos);
  if (!acceso.success) return DATOS_INVALIDOS;

  try {
    const creado = await apiFetchConSesion<AccesoFabricante>(
      `admin/marcas/${encodeURIComponent(id)}/usuario`,
      { method: "POST", body: acceso.data },
    );
    refresh();
    return { acceso: creado };
  } catch (error) {
    return errorDeApi(error, { campo: "email" });
  }
}
