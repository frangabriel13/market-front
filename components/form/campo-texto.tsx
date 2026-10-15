"use client";

import type { ComponentProps, ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  label: string;
  descripcion?: ReactNode;
  multilinea?: boolean;
} & Omit<ComponentProps<"input">, "name" | "id" | "value" | "onChange">;

export function CampoTexto<T extends FieldValues, TOut extends FieldValues>({
  control,
  name,
  label,
  descripcion,
  multilinea,
  ...inputProps
}: Props<T, TOut>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const props = {
          ...field,
          id: name,
          value: (field.value as string | null | undefined) ?? "",
          "aria-invalid": fieldState.invalid,
        };
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {multilinea ? (
              <Textarea {...props} maxLength={inputProps.maxLength} rows={5} />
            ) : (
              <Input {...inputProps} {...props} />
            )}
            {descripcion && <FieldDescription>{descripcion}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}
