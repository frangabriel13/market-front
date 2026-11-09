"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  etiqueta: string;
  inicial?: string;
  placeholder?: string;
  maxLength: number;
  pendiente: boolean;
  // Devuelve el problema del texto, si lo hay, para mostrarlo sin guardar.
  validar: (texto: string) => string | undefined;
  onGuardar: (texto: string) => void;
  onCancelar?: () => void;
  textoBoton?: string;
};

// Un campo con su botón: para agregar un valor o cambiarle el nombre.
export function EdicionEnLinea({
  etiqueta,
  inicial = "",
  placeholder,
  maxLength,
  pendiente,
  validar,
  onGuardar,
  onCancelar,
  textoBoton,
}: Props) {
  const [texto, setTexto] = useState(inicial);
  const [aviso, setAviso] = useState<string>();

  return (
    <form
      noValidate
      className="flex flex-col gap-1"
      onSubmit={(evento) => {
        evento.preventDefault();
        const limpio = texto.trim();
        const problema = validar(limpio);
        if (problema) return setAviso(problema);
        onGuardar(limpio);
      }}
    >
      <div className="flex gap-2">
        <Input
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setAviso(undefined);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancelar?.();
          }}
          aria-label={etiqueta}
          aria-invalid={Boolean(aviso)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={pendiente}
          autoFocus={Boolean(onCancelar)}
        />
        {textoBoton ? (
          <Button type="submit" variant="outline" disabled={pendiente}>
            {textoBoton}
          </Button>
        ) : (
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={pendiente}
            aria-label="Guardar"
          >
            <Check />
          </Button>
        )}
        {onCancelar && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={pendiente}
            onClick={onCancelar}
            aria-label="Cancelar"
          >
            <X />
          </Button>
        )}
      </div>
      {aviso && <p className="text-sm text-destructive">{aviso}</p>}
    </form>
  );
}
