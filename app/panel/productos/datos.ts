import "server-only";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/error";
import { apiFetchConSesion } from "@/lib/api/con-sesion";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import type { MarcaPanel } from "@/lib/schemas/marcas";
import type { Producto } from "@/lib/schemas/productos";

export function obtenerCategorias(): Promise<CategoriaConSubcategorias[]> {
  return apiFetchConSesion("panel/categorias");
}

export function obtenerMarca(): Promise<MarcaPanel> {
  return apiFetchConSesion("panel/marca");
}

export async function obtenerProducto(id: string): Promise<Producto> {
  try {
    return await apiFetchConSesion(`panel/productos/${encodeURIComponent(id)}`);
  } catch (error) {
    // 400: id con formato inválido; 404: no existe o es de otra marca.
    if (error instanceof ApiError && [400, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }
}
