"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useHidratado } from "@/hooks/use-hidratado";
import { unidadesDe, useCarrito } from "@/lib/carrito";
import { RUTA_CARRITO } from "./rutas";

// Celular: el ícono con las unidades encima. Escritorio: con el texto.
export function BotonCarrito() {
  const unidades = useCarrito((carrito) => unidadesDe(carrito.items));
  const cantidad = useHidratado() ? unidades : 0;
  return (
    <Link
      href={RUTA_CARRITO}
      aria-label={cantidad ? `Tu pedido: ${cantidad} unidades` : "Tu pedido"}
      className="relative flex h-11 min-w-11 items-center justify-center gap-2 text-sm font-semibold hover:underline md:justify-end"
    >
      <ShoppingBag className="size-5.5" />
      <span className="hidden md:inline">
        Tu pedido{cantidad > 0 && ` (${cantidad > 99 ? "99+" : cantidad})`}
      </span>
      {cantidad > 0 && (
        <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background md:hidden">
          {cantidad > 99 ? "99+" : cantidad}
        </span>
      )}
    </Link>
  );
}
