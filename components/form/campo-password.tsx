"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues, TOut extends FieldValues> = {
  control: Control<T, unknown, TOut>;
  name: Path<T>;
  label: string;
  autoComplete: "current-password" | "new-password";
};

export function CampoPassword<T extends FieldValues, TOut extends FieldValues>({
  control,
  name,
  label,
  autoComplete,
}: Props<T, TOut>) {
  const [visible, setVisible] = useState(false);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={visible ? "text" : "password"}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className="pr-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute top-0 right-0 text-muted-foreground hover:bg-transparent"
            >
              {visible ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
