"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useHidratado } from "@/hooks/use-hidratado";
import { CANTIDAD_MAXIMA, useCarrito, type ItemCarrito } from "@/lib/carrito";
import { formatearPrecio } from "@/lib/formato";
import type { VarianteProducto } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { RUTA_CARRITO } from "../../rutas";

type Props = {
  producto: Omit<ItemCarrito, "color" | "talle" | "cantidad">;
  variantes: VarianteProducto[];
};

const clave = (color: string, talle: string) => `${color}\u0000${talle}`;

const unidades = (n: number) => `${n} ${n === 1 ? "unidad" : "unidades"}`;

// La grilla muestra lo que ya hay en el pedido de este producto; al guardar,
// lo reemplaza. Las variantes llegan en el orden de las listas de la marca.
export function ElegirCantidades({ producto, variantes }: Props) {
  const colores = [...new Set(variantes.map((v) => v.color))];
  const talles = [...new Set(variantes.map((v) => v.talle))];
  const hay = (color: string, talle: string) =>
    variantes.some((v) => v.color === color && v.talle === talle && v.disponible);

  const enPedido = useCarrito(
    useShallow(({ items }) =>
      items.filter((item) => item.productoId === producto.productoId),
    ),
  );
  const reemplazarProducto = useCarrito((carrito) => carrito.reemplazarProducto);
  const hidratado = useHidratado();
  const [elegidas, setElegidas] = useState<Record<string, number> | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Next oculta la página al salir sin desmontarla: al volver, se parte del pedido.
  useLayoutEffect(
    () => () => {
      setElegidas(null);
      setAviso(null);
    },
    [],
  );

  const guardadas = Object.fromEntries(
    (hidratado ? enPedido : []).map((item) => [
      clave(item.color, item.talle),
      item.cantidad,
    ]),
  );
  const cantidades = elegidas ?? guardadas;
  const cantidad = (color: string, talle: string) =>
    hay(color, talle) ? (cantidades[clave(color, talle)] ?? 0) : 0;
  const total = colores.reduce(
    (suma, color) => suma + talles.reduce((s, talle) => s + cantidad(color, talle), 0),
    0,
  );
  const yaEnPedido = hidratado && enPedido.length > 0;

  function cambiar(color: string, talle: string, diferencia: number) {
    const nueva = Math.min(
      CANTIDAD_MAXIMA,
      Math.max(0, cantidad(color, talle) + diferencia),
    );
    setElegidas({ ...cantidades, [clave(color, talle)]: nueva });
    setAviso(null);
  }

  function guardar() {
    reemplazarProducto(
      producto.productoId,
      colores.flatMap((color) =>
        talles
          .filter((talle) => cantidad(color, talle) > 0)
          .map((talle) => ({
            ...producto,
            color,
            talle,
            cantidad: cantidad(color, talle),
          })),
      ),
    );
    setElegidas(null);
    setAviso(
      total === 0
        ? "Sacamos este producto de tu pedido."
        : `Listo: tenés ${unidades(total)} de este producto en tu pedido.`,
    );
  }

  if (!colores.some((color) => talles.some((talle) => hay(color, talle)))) {
    return (
      <p className="bg-muted p-3 text-sm">
        Este producto está agotado en todos sus colores y talles.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold tracking-wider uppercase">
        Elegí cantidades por color y talle
      </h2>
      <div className="-mx-4 overflow-x-auto px-3">
        <table className="w-full border-separate border-spacing-1.5">
          <thead>
            <tr>
              <td />
              {talles.map((talle) => (
                <th key={talle} scope="col" className="text-sm font-bold">
                  {talle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colores.map((color) => (
              <tr key={color}>
                <th scope="row" className="pr-1 text-left text-sm font-semibold">
                  {color}
                </th>
                {talles.map((talle) => (
                  <td key={talle}>
                    {hay(color, talle) ? (
                      <Casillero
                        etiqueta={`${color} ${talle}`}
                        cantidad={cantidad(color, talle)}
                        onSumar={() => cambiar(color, talle, 1)}
                        onRestar={() => cambiar(color, talle, -1)}
                      />
                    ) : (
                      <div className="flex h-12 min-w-14 items-center justify-center border border-dashed border-input text-[10px] font-bold text-muted-foreground uppercase">
                        Agotado
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>Cada toque suma una unidad.</p>
        {total > 0 && (
          <button
            type="button"
            onClick={() => {
              setElegidas({});
              setAviso(null);
            }}
            className="font-semibold text-foreground underline underline-offset-4"
          >
            Borrar selección
          </button>
        )}
      </div>
      <p
        aria-live="polite"
        className="flex items-baseline justify-between border-t pt-3"
      >
        <span>
          Total: <strong>{unidades(total)}</strong>
        </span>
        <strong className="text-lg">
          {formatearPrecio(total * producto.precio)}
        </strong>
      </p>
      <Button
        size="lg"
        disabled={elegidas === null || (total === 0 && !yaEnPedido)}
        onClick={guardar}
      >
        {yaEnPedido ? "Actualizar pedido" : "Agregar al pedido"}
      </Button>
      {aviso && (
        <p role="status" className="text-sm text-success">
          {aviso}{" "}
          <Link href={RUTA_CARRITO} className="font-bold underline">
            Ver pedido
          </Link>
        </p>
      )}
    </section>
  );
}

function Casillero({
  etiqueta,
  cantidad,
  onSumar,
  onRestar,
}: {
  etiqueta: string;
  cantidad: number;
  onSumar: () => void;
  onRestar: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSumar}
        aria-label={`Sumar una unidad de ${etiqueta}${cantidad ? ` (van ${cantidad})` : ""}`}
        className={cn(
          "flex h-12 w-full min-w-14 items-center justify-center text-lg",
          cantidad
            ? "bg-foreground font-bold text-background"
            : "bg-muted hover:bg-accent",
        )}
      >
        {cantidad || <Plus className="size-4" />}
      </button>
      {cantidad > 0 && (
        <button
          type="button"
          onClick={onRestar}
          aria-label={`Restar una unidad de ${etiqueta}`}
          className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-input bg-background"
        >
          <Minus className="size-3" />
        </button>
      )}
    </div>
  );
}
