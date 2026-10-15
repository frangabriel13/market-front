"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { CampoPassword } from "@/components/form/campo-password";
import { CampoTexto } from "@/components/form/campo-texto";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import { loginSchema, type Login, type LoginInput } from "@/lib/schemas/auth";
import { iniciarSesion } from "./acciones";

export function LoginForm() {
  const form = useForm<LoginInput, unknown, Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  // Next deja la página oculta al navegar: que no quede la contraseña.
  useLayoutEffect(() => () => form.reset(), [form]);

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
      onSubmit={(evento) => form.handleSubmit(onSubmit)(evento)}
      className="flex flex-col gap-5"
    >
      <CampoTexto
        control={form.control}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
      />
      <CampoPassword
        control={form.control}
        name="password"
        label="Contraseña"
        autoComplete="current-password"
      />

      {errors.root && <ErrorFormulario>{errors.root.message}</ErrorFormulario>}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </Button>
      <Link
        href="/recuperar"
        className="self-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
