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
  agregar: (item: ItemCarrito) => void;
  cambiarCantidad: (variante: Variante, cantidad: number) => void;
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
      agregar: (nuevo) =>
        set(({ items }) => {
          const existente = items.find((item) => mismaVariante(item, nuevo));
          if (!existente) return { items: [...items, nuevo] };
          const cantidad = Math.min(
            CANTIDAD_MAXIMA,
            existente.cantidad + nuevo.cantidad,
          );
          return {
            items: items.map((item) =>
              item === existente ? { ...nuevo, cantidad } : item,
            ),
          };
        }),
      cambiarCantidad: (variante, cantidad) =>
        set(({ items }) => ({
          items: items.map((item) =>
            mismaVariante(item, variante) ? { ...item, cantidad } : item,
          ),
        })),
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
