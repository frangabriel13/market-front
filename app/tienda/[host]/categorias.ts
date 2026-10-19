import type { CategoriaTienda } from "@/lib/schemas/tienda";

export type Ubicacion = {
  categoria: CategoriaTienda;
  subcategoria?: CategoriaTienda["subcategorias"][number];
};

// Solo encuentra las que tienen productos visibles en la tienda.
export function ubicarCategoria(
  categorias: CategoriaTienda[],
  slug: string,
): Ubicacion | null {
  for (const categoria of categorias) {
    if (categoria.slug === slug) return { categoria };
    const subcategoria = categoria.subcategorias.find((s) => s.slug === slug);
    if (subcategoria) return { categoria, subcategoria };
  }
  return null;
}

export const tituloDe = ({ categoria, subcategoria }: Ubicacion) =>
  subcategoria ? `${categoria.nombre} › ${subcategoria.nombre}` : categoria.nombre;
