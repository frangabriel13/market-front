import { SIN_VALOR, type VarianteProducto } from "@/lib/schemas/productos";

// Colores y talles elegidos para el producto (en el orden de las listas de la
// marca) y las combinaciones agotadas. Lo que no está agotado, hay.
export interface Matriz {
  colores: string[];
  talles: string[];
  agotadas: string[];
}

// Los colores de la marca y los talles de la lista del producto, en orden.
// Sin colores o sin talles, esa lista es [SIN_VALOR]: siempre elegida, sin
// mostrarse.
export interface ValoresDisponibles {
  colores: string[];
  talles: string[];
}

export const SIN_ELEGIR = [SIN_VALOR];

export const esFijo = (valores: string[]) =>
  valores.length === 1 && valores[0] === SIN_VALOR;

export const clave = (color: string, talle: string) => `${color}\u0000${talle}`;

export function matrizDe(
  variantes: VarianteProducto[],
  { colores, talles }: ValoresDisponibles,
): Matriz {
  return {
    colores: colores.filter((c) => variantes.some((v) => v.color === c)),
    talles: talles.filter((t) => variantes.some((v) => v.talle === t)),
    agotadas: variantes
      .filter((v) => !v.disponible)
      .map((v) => clave(v.color, v.talle)),
  };
}

// La matriz para otros valores (al cambiar la lista o la modalidad): queda lo
// que sigue existiendo y lo fijo se elige solo.
export function ajustar(
  { colores, talles, agotadas }: Matriz,
  valores: ValoresDisponibles,
): Matriz {
  const ajustados = (elegidos: string[], disponibles: string[]) =>
    esFijo(disponibles)
      ? SIN_ELEGIR
      : disponibles.filter((valor) => elegidos.includes(valor));
  return {
    colores: ajustados(colores, valores.colores),
    talles: ajustados(talles, valores.talles),
    agotadas,
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
