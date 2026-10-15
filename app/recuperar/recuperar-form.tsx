"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import { recuperarSchema, type RecuperarInput } from "@/lib/schemas/auth";
import { pedirLink } from "./acciones";

export function RecuperarForm() {
  const form = useForm<RecuperarInput, unknown, { email: string }>({
    resolver: zodResolver(recuperarSchema),
    defaultValues: { email: "" },
  });
  const [enviado, setEnviado] = useState(false);
  const { errors, isSubmitting } = form.formState;

  useLayoutEffect(
    () => () => {
      setEnviado(false);
      form.reset();
    },
    [form],
  );

  async function onSubmit(datos: { email: string }) {
    const resultado = await pedirLink(datos);
    if (resultado) return form.setError("root", { message: resultado.error });
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="flex flex-col gap-5">
        <p role="status" className="border bg-secondary px-3 py-2.5 text-sm">
          Si <strong>{form.getValues("email")}</strong> tiene una cuenta, te
          mandamos un link para elegir una contraseña nueva. Vence en 1 hora:
          revisá también la carpeta de spam.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Volver a ingresar</Link>
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
      {errors.root && <ErrorFormulario>{errors.root.message}</ErrorFormulario>}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviarme el link"}
      </Button>
      <Link
        href="/login"
        className="self-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Volver a ingresar
      </Link>
    </form>
  );
}
