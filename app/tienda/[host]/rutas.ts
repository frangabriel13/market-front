import type { TipoTextoLegal } from "@/lib/schemas/legales";

export const rutaCategoria = (slug: string) => `/categoria/${slug}`;

export const rutaProducto = (id: string) => `/producto/${id}`;

export const RUTA_COMO_COMPRAR = "/como-comprar";

export const RUTA_CONDICIONES = "/condiciones";

export const RUTAS_LEGALES: Record<TipoTextoLegal, string> = {
  TERMINOS: "/terminos",
  PRIVACIDAD: "/privacidad",
};
