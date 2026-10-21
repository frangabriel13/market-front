"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCarrito, type ItemCarrito } from "@/lib/carrito";
import type { VarianteProducto } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { RUTA_CARRITO } from "../../rutas";
import { SelectorCantidad } from "../../selector-cantidad";
import { GuiaTalles } from "./guia-talles";

type Props = {
  producto: Omit<ItemCarrito, "color" | "talle" | "cantidad">;
  variantes: VarianteProducto[];
  guiaTallesUrl: string | null;
};

// Las variantes llegan en el orden de las listas de la marca.
export function ElegirVariante({ producto, variantes, guiaTallesUrl }: Props) {
  const colores = [...new Set(variantes.map((v) => v.color))];
  const talles = [...new Set(variantes.map((v) => v.talle))];
  const hay = (color: string, talle: string) =>
    variantes.some((v) => v.color === color && v.talle === talle && v.disponible);
  const colorConStock = (color: string) => talles.some((t) => hay(color, t));

  const [color, setColor] = useState(() => colores.find(colorConStock) ?? null);
  const [talle, setTalle] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState<string | null>(null);
  const agregar = useCarrito((carrito) => carrito.agregar);

  // Next oculta la página al salir sin desmontarla: el aviso no queda al volver.
  useLayoutEffect(() => () => setAgregado(null), []);

  function elegir(cambio: () => void) {
    cambio();
    setAgregado(null);
  }

  function agregarAlPedido() {
    if (!color || !talle) return;
    agregar({ ...producto, color, talle, cantidad });
    setAgregado(
      `Agregaste ${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} (${color} / ${talle}).`,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Grupo titulo="Color" elegido={color}>
        {colores.map((c) => (
          <Opcion
            key={c}
            texto={c}
            elegida={c === color}
            agotada={!colorConStock(c)}
            onClick={() =>
              elegir(() => {
                setColor(c);
                if (talle && !hay(c, talle)) setTalle(null);
              })
            }
          />
        ))}
      </Grupo>
      <Grupo
        titulo="Talle"
        elegido={talle}
        extra={guiaTallesUrl && <GuiaTalles url={guiaTallesUrl} />}
      >
        {talles.map((t) => (
          <Opcion
            key={t}
            texto={t}
            elegida={t === talle}
            agotada={!color || !hay(color, t)}
            onClick={() => elegir(() => setTalle(t))}
          />
        ))}
      </Grupo>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Cantidad</p>
        <SelectorCantidad
          valor={cantidad}
          onChange={(nueva) => elegir(() => setCantidad(nueva))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button size="lg" disabled={!color || !talle} onClick={agregarAlPedido}>
          {!color ? "Agotado" : !talle ? "Elegí un talle" : "Agregar al pedido"}
        </Button>
        {agregado && (
          <p role="status" className="text-sm text-success">
            {agregado}{" "}
            <Link href={RUTA_CARRITO} className="font-bold underline">
              Ver pedido
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

function Grupo({
  titulo,
  elegido,
  extra,
  children,
}: {
  titulo: string;
  elegido: string | null;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <div className="mb-2 flex items-center justify-between gap-4">
        <legend className="text-sm">
          <span className="font-bold">{titulo}</span>
          {elegido && `: ${elegido}`}
        </legend>
        {extra}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Opcion({
  texto,
  elegida,
  agotada,
  onClick,
}: {
  texto: string;
  elegida: boolean;
  agotada: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={elegida}
      disabled={agotada}
      onClick={onClick}
      className={cn(
        "h-10 min-w-12 border px-3 text-sm",
        elegida
          ? "border-foreground bg-foreground font-bold text-background"
          : "border-border hover:border-foreground",
        agotada && "border-dashed text-muted-foreground line-through",
      )}
    >
      {texto}
      {agotada && <span className="sr-only"> (agotado)</span>}
    </button>
  );
}
