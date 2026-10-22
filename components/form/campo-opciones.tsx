"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export type Opcion = { valor: string; titulo: string; detalle?: string };

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  titulo: string;
  descripcion?: string;
  opciones: Opcion[];
  onElegir?: (valor: string) => void;
  className?: string;
};

// Tarjetas con radio: todas las opciones a la vista, sin abrir un selector.
export function CampoOpciones<T extends FieldValues, TOut extends FieldValues>({
  control,
  name,
  titulo,
  descripcion,
  opciones,
  onElegir,
  className,
}: Props<T, TOut>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-bold tracking-wider uppercase">
            {titulo}
          </legend>
          {descripcion && (
            <p className="-mt-1 mb-1 text-sm text-muted-foreground">
              {descripcion}
            </p>
          )}
          <div className={cn("flex flex-col gap-2", className)}>
            {opciones.map((opcion) => (
              <label
                key={opcion.valor}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-3 text-sm",
                  field.value === opcion.valor
                    ? "border-2 border-foreground"
                    : "border-input",
                )}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={opcion.valor}
                  checked={field.value === opcion.valor}
                  onChange={() => {
                    field.onChange(opcion.valor);
                    onElegir?.(opcion.valor);
                  }}
                  onBlur={field.onBlur}
                  className="mt-0.5 accent-foreground"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-bold">{opcion.titulo}</span>
                  {opcion.detalle && (
                    <span className="text-muted-foreground">{opcion.detalle}</span>
                  )}
                </span>
              </label>
            ))}
          </div>
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </fieldset>
      )}
    />
  );
}
