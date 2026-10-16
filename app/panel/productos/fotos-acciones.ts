"use server";

import { refresh } from "next/cache";
import { errorDeApi, type ErrorAccion } from "@/lib/acciones/errores";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { ArchivoImagen, UrlDeSubida } from "@/lib/schemas/imagenes";
import {
  fotoRegistrarSchema,
  fotosOrdenSchema,
  fotoSubidaSchema,
} from "@/lib/schemas/productos";

const ruta = (productoId: string, resto = "") =>
  `panel/productos/${encodeURIComponent(productoId)}/fotos${resto}`;

export async function pedirUrlDeFoto(
  productoId: string,
  archivo: ArchivoImagen,
): Promise<{ subida: UrlDeSubida } | ErrorAccion> {
  const datos = fotoSubidaSchema.safeParse({ productoId, ...archivo });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Imagen inválida." };
  }

  try {
    const subida = await apiFetchConSesion<UrlDeSubida>("panel/fotos", {
      method: "POST",
      body: datos.data,
    });
    return { subida };
  } catch (error) {
    // 503: el almacenamiento no está configurado en la API; el mensaje lo explica.
    if (error instanceof ApiError && error.status === 503) {
      return { error: error.message };
    }
    return errorDeApi(error);
  }
}

// Registra la foto ya subida: la API genera la miniatura y la pone al final.
export async function registrarFoto(
  productoId: string,
  url: string,
): Promise<ErrorAccion | undefined> {
  const datos = fotoRegistrarSchema.safeParse({ url });
  if (!datos.success) return { error: "La foto no se subió bien." };

  try {
    await apiFetchConSesion(ruta(productoId), {
      method: "POST",
      body: datos.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}

export async function ordenarFotos(
  productoId: string,
  fotoIds: string[],
): Promise<ErrorAccion | undefined> {
  const datos = fotosOrdenSchema.safeParse({ fotoIds });
  if (!datos.success) return { error: "Orden inválido." };

  try {
    await apiFetchConSesion(ruta(productoId, "/orden"), {
      method: "PUT",
      body: datos.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}

export async function quitarFoto(
  productoId: string,
  fotoId: string,
): Promise<ErrorAccion | undefined> {
  try {
    await apiFetchConSesion(ruta(productoId, `/${encodeURIComponent(fotoId)}`), {
      method: "DELETE",
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
