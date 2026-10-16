import type { MarcaPanel } from "@/lib/schemas/marcas";
import type { VarianteProducto } from "@/lib/schemas/productos";

// Colores y talles elegidos para el producto (en el orden de las listas de la
// marca) y las combinaciones agotadas. Lo que no está agotado, hay.
export interface Matriz {
  colores: string[];
  talles: string[];
  agotadas: string[];
}

export const clave = (color: string, talle: string) => `${color}\u0000${talle}`;

export function matrizDe(
  variantes: VarianteProducto[],
  { colores, talles }: Pick<MarcaPanel, "colores" | "talles">,
): Matriz {
  return {
    colores: colores.filter((c) => variantes.some((v) => v.color === c)),
    talles: talles.filter((t) => variantes.some((v) => v.talle === t)),
    agotadas: variantes
      .filter((v) => !v.disponible)
      .map((v) => clave(v.color, v.talle)),
  };
}

// La matriz completa que pide la API: cada color en cada talle.
export function variantesDe({
  colores,
  talles,
  agotadas,
}: Matriz): VarianteProducto[] {
  return colores.flatMap((color) =>
    talles.map((talle) => ({
      color,
      talle,
      disponible: !agotadas.includes(clave(color, talle)),
    })),
  );
}

// Agrega o saca `item`, manteniendo el orden de `lista` (la de la marca).
export function alternar(elegidos: string[], item: string, lista: string[]) {
  return elegidos.includes(item)
    ? elegidos.filter((e) => e !== item)
    : lista.filter((e) => e === item || elegidos.includes(e));
}
