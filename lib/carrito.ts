import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CANTIDAD_MAXIMA = 999;

// El precio es solo para mostrar: la API lo recalcula al crear el pedido.
export interface ItemCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  miniatura: string | null;
  color: string;
  talle: string;
  cantidad: number;
}

export type Variante = Pick<ItemCarrito, "productoId" | "color" | "talle">;

interface Carrito {
  items: ItemCarrito[];
  // Lo que se eligió en la grilla de un producto reemplaza lo que tenía.
  reemplazarProducto: (productoId: string, items: ItemCarrito[]) => void;
  quitar: (variante: Variante) => void;
  vaciar: () => void;
}

const mismaVariante = (a: Variante, b: Variante) =>
  a.productoId === b.productoId && a.color === b.color && a.talle === b.talle;

// localStorage es de cada origen y cada marca tiene su host: queda un carrito
// por marca sin separarlos a mano.
export const useCarrito = create<Carrito>()(
  persist(
    (set) => ({
      items: [],
      reemplazarProducto: (productoId, nuevos) =>
        set(({ items }) => {
          const lugar = items.findIndex(
            (item) => item.productoId === productoId,
          );
          const resto = items.filter((item) => item.productoId !== productoId);
          // Si ya estaba, queda en el mismo lugar del pedido.
          const posicion = lugar === -1 ? resto.length : lugar;
          return {
            items: [
              ...resto.slice(0, posicion),
              ...nuevos,
              ...resto.slice(posicion),
            ],
          };
        }),
      quitar: (variante) =>
        set(({ items }) => ({
          items: items.filter((item) => !mismaVariante(item, variante)),
        })),
      vaciar: () => set({ items: [] }),
    }),
    { name: "carrito", version: 1 },
  ),
);

export const unidadesDe = (items: ItemCarrito[]) =>
  items.reduce((total, item) => total + item.cantidad, 0);

export const totalDe = (items: ItemCarrito[]) =>
  items.reduce((total, item) => total + item.precio * item.cantidad, 0);

export interface ProductoEnCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  miniatura: string | null;
  items: ItemCarrito[];
}

// Las líneas de cada producto juntas, en el orden en que se agregaron.
export function agruparPorProducto(items: ItemCarrito[]): ProductoEnCarrito[] {
  const grupos = new Map<string, ProductoEnCarrito>();
  for (const item of items) {
    const grupo = grupos.get(item.productoId);
    if (grupo) {
      grupo.items.push(item);
    } else {
      const { productoId, nombre, precio, miniatura } = item;
      grupos.set(productoId, { productoId, nombre, precio, miniatura, items: [item] });
    }
  }
  return [...grupos.values()];
}
