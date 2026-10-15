"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { unstable_rethrow } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type Login, type LoginInput } from "@/lib/schemas/auth";
import { iniciarSesion } from "./acciones";

export function LoginForm() {
  const [verPassword, setVerPassword] = useState(false);
  const form = useForm<LoginInput, unknown, Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  // Si el login sale bien, la acción redirige y no vuelve.
  async function onSubmit(datos: Login) {
    try {
      const resultado = await iniciarSesion(datos);
      if (resultado?.error) form.setError("root", { message: resultado.error });
    } catch (error) {
      // El redirect() de la acción llega como error: se lo devuelve a Next.
      unstable_rethrow(error);
      form.setError("root", {
        message: "No pudimos iniciar sesión. Probá de nuevo.",
      });
    }
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id="password"
                type={verPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="pr-11"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setVerPassword((ver) => !ver)}
                aria-label={
                  verPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute top-0 right-0 text-muted-foreground hover:bg-transparent"
              >
                {verPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {errors.root && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
