"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
  DATOS_INVALIDOS,
  errorDeApi,
  type ErrorAccion,
} from "@/lib/acciones/errores";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import {
  productoCrearSchema,
  productoEditarSchema,
  type Producto,
  type ProductoCrearInput,
  type ProductoEditarInput,
} from "@/lib/schemas/productos";

export async function crearProducto(
  datos: ProductoCrearInput,
): Promise<ErrorAccion> {
  const producto = productoCrearSchema.safeParse(datos);
  if (!producto.success) return DATOS_INVALIDOS;

  let id: string;
  try {
    ({ id } = await apiFetchConSesion<Producto>("panel/productos", {
      method: "POST",
      body: producto.data,
    }));
  } catch (error) {
    return errorDeApi(error);
  }
  redirect(`/panel/productos/${id}`);
}

export async function eliminarProducto(id: string): Promise<ErrorAccion> {
  try {
    await apiFetchConSesion(`panel/productos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (error) {
    return errorDeApi(error);
  }
  redirect("/panel");
}

export async function editarProducto(
  id: string,
  datos: ProductoEditarInput,
): Promise<ErrorAccion | undefined> {
  const producto = productoEditarSchema.safeParse(datos);
  if (!producto.success) return DATOS_INVALIDOS;

  try {
    await apiFetchConSesion(`panel/productos/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: producto.data,
    });
  } catch (error) {
    return errorDeApi(error);
  }
  refresh();
}
