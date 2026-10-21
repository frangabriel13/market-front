"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { CANTIDAD_MAXIMA } from "@/lib/carrito";

type Props = { valor: number; onChange: (cantidad: number) => void };

export function SelectorCantidad({ valor, onChange }: Props) {
  // Texto aparte para poder borrar el número mientras se escribe.
  const [texto, setTexto] = useState(String(valor));

  function cambiar(cantidad: number) {
    const acotada = Math.min(CANTIDAD_MAXIMA, Math.max(1, cantidad));
    onChange(acotada);
    setTexto(String(acotada));
  }

  return (
    <div className="flex h-10 w-fit items-center border">
      <button
        type="button"
        aria-label="Restar uno"
        disabled={valor <= 1}
        onClick={() => cambiar(valor - 1)}
        className="flex size-10 items-center justify-center disabled:text-muted-foreground"
      >
        <Minus className="size-4" />
      </button>
      <input
        aria-label="Cantidad"
        inputMode="numeric"
        value={texto}
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, "").slice(0, 3);
          setTexto(digitos);
          if (Number(digitos) >= 1) onChange(Number(digitos));
        }}
        onBlur={() => setTexto(String(valor))}
        onFocus={(e) => e.target.select()}
        className="h-full w-12 border-x text-center outline-none focus-visible:bg-muted"
      />
      <button
        type="button"
        aria-label="Sumar uno"
        disabled={valor >= CANTIDAD_MAXIMA}
        onClick={() => cambiar(valor + 1)}
        className="flex size-10 items-center justify-center disabled:text-muted-foreground"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
