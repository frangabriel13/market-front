"use client";

import { useState } from "react";
import type { VarianteProducto } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { GuiaTalles } from "./guia-talles";

type Props = { variantes: VarianteProducto[]; guiaTallesUrl: string | null };

// Las variantes llegan en el orden de las listas de la marca.
export function ElegirVariante({ variantes, guiaTallesUrl }: Props) {
  const colores = [...new Set(variantes.map((v) => v.color))];
  const talles = [...new Set(variantes.map((v) => v.talle))];
  const hay = (color: string, talle: string) =>
    variantes.some((v) => v.color === color && v.talle === talle && v.disponible);
  const colorConStock = (color: string) => talles.some((t) => hay(color, t));

  const [color, setColor] = useState(() => colores.find(colorConStock) ?? null);
  const [talle, setTalle] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <Grupo titulo="Color" elegido={color}>
        {colores.map((c) => (
          <Opcion
            key={c}
            texto={c}
            elegida={c === color}
            agotada={!colorConStock(c)}
            onClick={() => {
              setColor(c);
              if (talle && !hay(c, talle)) setTalle(null);
            }}
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
            onClick={() => setTalle(t)}
          />
        ))}
      </Grupo>
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
