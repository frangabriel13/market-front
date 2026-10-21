"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  label: string;
  placeholder: string;
  opciones: string[];
  autoComplete?: string;
};

// Select nativo: en el celular abre el selector del sistema.
export function CampoLista<T extends FieldValues, TOut extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  opciones,
  autoComplete,
}: Props<T, TOut>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <select
            {...field}
            value={(field.value as string | null | undefined) ?? ""}
            id={id}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
