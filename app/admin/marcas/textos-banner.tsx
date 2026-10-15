"use client";

import { Plus, X } from "lucide-react";
import type { FieldError, Merge } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAXIMO = 3;

type Props = {
  value: string[];
  onChange: (valor: string[]) => void;
  errores?: Merge<FieldError, (FieldError | undefined)[]>;
};

export function TextosBanner({ value, onChange, errores }: Props) {
  function cambiar(indice: number, texto: string) {
    onChange(value.map((actual, i) => (i === indice ? texto : actual)));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((texto, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Input
              value={texto}
              onChange={(e) => cambiar(i, e.target.value)}
              maxLength={120}
              aria-label={`Texto ${i + 1} del banner`}
              aria-invalid={!!errores?.[i]}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={`Quitar texto ${i + 1}`}
            >
              <X />
            </Button>
          </div>
          {errores?.[i] && (
            <p className="text-sm text-destructive">{errores[i].message}</p>
          )}
        </div>
      ))}
      {value.length < MAXIMO && (
        <Button
          type="button"
          variant="outline"
          className="self-start"
          onClick={() => onChange([...value, ""])}
        >
          <Plus />
          Agregar texto
        </Button>
      )}
    </div>
  );
}
