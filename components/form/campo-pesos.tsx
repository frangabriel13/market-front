"use client";

import { useId, type ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  label: string;
  descripcion?: ReactNode;
};

// Pesos enteros: muestra "12.500" y guarda 12500.
export function CampoPesos<T extends FieldValues, TOut extends FieldValues>({
  control,
  name,
  label,
  descripcion,
}: Props<T, TOut>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              $
            </span>
            <Input
              id={id}
              inputMode="numeric"
              maxLength={11}
              className="pl-7"
              value={(field.value as number | undefined)?.toLocaleString("es-AR") ?? ""}
              onChange={(e) => {
                const digitos = e.target.value.replace(/\D/g, "");
                field.onChange(digitos ? Number(digitos) : undefined);
              }}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
            />
          </div>
          {descripcion && <FieldDescription>{descripcion}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
