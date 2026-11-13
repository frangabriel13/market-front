import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ApiError } from "@/lib/api/server";
import { tiendaFetch } from "@/lib/api/tienda";
import type { TextoLegal, TipoTextoLegal } from "@/lib/schemas/legales";
import type {
  CategoriaTienda,
  MarcaTienda,
  ProductoTienda,
  ProductoTiendaResumen,
} from "@/lib/schemas/tienda";

// cache: el layout, la página y los metadatos piden lo mismo en un request.
export const obtenerMarca = cache((host: string) =>
  tiendaFetch<MarcaTienda>(host, "tienda"),
);

export const obtenerCategorias = cache((host: string) =>
  tiendaFetch<CategoriaTienda[]>(host, "tienda/categorias"),
);

export const obtenerDestacados = (host: string) =>
  tiendaFetch<ProductoTiendaResumen[]>(host, "tienda/destacados");

export const obtenerTodos = (host: string) =>
  tiendaFetch<ProductoTiendaResumen[]>(host, "tienda/productos");

// La miniatura del producto más nuevo de la categoría, para su círculo en el
// inicio. Sin foto o si falla, null: el círculo muestra la inicial.
// TODO(7.32): que la traiga GET /tienda/categorias y sacar estos pedidos.
export const obtenerFotoDeCategoria = (host: string, slug: string) =>
  tiendaFetch<ProductoTiendaResumen[]>(
    host,
    `tienda/productos?categoria=${encodeURIComponent(slug)}`,
  )
    .then((productos) => productos.find((p) => p.miniatura)?.miniatura ?? null)
    .catch(() => null);

export const obtenerProductos = (host: string, categoria: string) =>
  oNoEncontrado(
    tiendaFetch<ProductoTiendaResumen[]>(
      host,
      `tienda/productos?categoria=${encodeURIComponent(categoria)}`,
    ),
  );

export const obtenerProducto = cache((host: string, id: string) =>
  oNoEncontrado(
    tiendaFetch<ProductoTienda>(host, `tienda/productos/${encodeURIComponent(id)}`),
  ),
);

// Son de la plataforma: el host no cambia el texto.
export const obtenerTextoLegal = (host: string, tipo: TipoTextoLegal) =>
  oNoEncontrado(tiendaFetch<TextoLegal>(host, `tienda/legales/${tipo}`));

// 400: parámetro con formato inválido; 404: no existe o no está visible.
async function oNoEncontrado<T>(pedido: Promise<T>): Promise<T> {
  try {
    return await pedido;
  } catch (error) {
    if (error instanceof ApiError && [400, 404].includes(error.status)) {
      notFound();
    }
    throw error;
  }
}
