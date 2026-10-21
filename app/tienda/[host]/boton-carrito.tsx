"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHidratado } from "@/hooks/use-hidratado";
import { unidadesDe, useCarrito } from "@/lib/carrito";
import { SOBRE_OSCURO } from "./estilos";
import { RUTA_CARRITO } from "./rutas";

export function BotonCarrito() {
  const unidades = useCarrito((carrito) => unidadesDe(carrito.items));
  const cantidad = useHidratado() ? unidades : 0;
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={`relative ${SOBRE_OSCURO}`}
    >
      <Link
        href={RUTA_CARRITO}
        aria-label={cantidad ? `Tu pedido: ${cantidad} unidades` : "Tu pedido"}
      >
        <ShoppingBag />
        {cantidad > 0 && (
          <span className="absolute top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-destacado px-1 text-[10px] font-bold text-destacado-foreground">
            {cantidad > 99 ? "99+" : cantidad}
          </span>
        )}
      </Link>
    </Button>
  );
}
