"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CampoPassword } from "@/components/form/campo-password";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import { restablecerSchema, type RestablecerInput } from "@/lib/schemas/auth";
import { restablecerPassword } from "./acciones";

type Datos = { token: string; password: string };

export function RestablecerForm({ token }: { token: string }) {
  const form = useForm<RestablecerInput, unknown, Datos>({
    resolver: zodResolver(restablecerSchema),
    defaultValues: { token, password: "" },
  });
  const [listo, setListo] = useState(false);
  const [linkInvalido, setLinkInvalido] = useState(false);
  const { errors, isSubmitting } = form.formState;

  // Next deja la página oculta al navegar: que no quede la contraseña.
  useLayoutEffect(() => () => form.reset(), [form]);

  async function onSubmit(datos: Datos) {
    const resultado = await restablecerPassword(datos);
    if (!resultado) return setListo(true);
    setLinkInvalido(Boolean(resultado.linkInvalido));
    form.setError("root", { message: resultado.error });
  }

  if (listo) {
    return (
      <div className="flex flex-col gap-5">
        <p role="status" className="border bg-secondary px-3 py-2.5 text-sm">
          Listo, ya podés ingresar con tu contraseña nueva.
        </p>
        <Button asChild size="lg">
          <Link href="/login">Ingresar</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(onSubmit)(evento)}
      className="flex flex-col gap-5"
    >
      <CampoPassword
        control={form.control}
        name="password"
        label="Contraseña nueva"
        autoComplete="new-password"
      />
      {errors.root && (
        <ErrorFormulario>
          {errors.root.message}
          {linkInvalido && (
            <>
              {" "}
              <Link href="/recuperar" className="font-medium underline">
                Pedí uno nuevo
              </Link>
            </>
          )}
        </ErrorFormulario>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
