"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SelectNativo } from "@/components/ui/select-nativo";

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  label: string;
  placeholder: string;
  opciones: string[];
  autoComplete?: string;
};

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
          <SelectNativo
            {...field}
            value={(field.value as string | null | undefined) ?? ""}
            id={id}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
            >
            <option value="" disabled>
              {placeholder}
            </option>
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </SelectNativo>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
