"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, KeyRound, MessageCircle } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  accesoFabricanteSchema,
  type AccesoFabricante,
  type AccesoFabricanteInput,
  type Marca,
} from "@/lib/schemas/marcas";
import { crearAcceso } from "./acciones";

type Datos = { email: string };

export function AccesoFabricanteSeccion({ marca }: { marca: Marca }) {
  const tieneAcceso = Boolean(marca.usuario);
  const form = useForm<AccesoFabricanteInput, unknown, Datos>({
    resolver: zodResolver(accesoFabricanteSchema),
    defaultValues: { email: marca.usuario?.email ?? "" },
  });
  const [confirmar, setConfirmar] = useState<Datos>();
  const [acceso, setAcceso] = useState<AccesoFabricante>();

  // La contraseña no tiene que quedar en la página oculta al navegar.
  useLayoutEffect(() => () => setAcceso(undefined), []);

  async function enviar(datos: Datos) {
    setAcceso(undefined);
    const resultado = await crearAcceso(marca.id, datos);
    if ("acceso" in resultado) return setAcceso(resultado.acceso);
    form.setError("root", { message: resultado.error });
    for (const [campo, mensaje] of Object.entries(resultado.campos ?? {})) {
      form.setError(campo as Path<AccesoFabricanteInput>, { message: mensaje });
    }
  }

  return (
    <section className="mb-8 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Acceso del fabricante</h2>
        <p className="text-sm text-muted-foreground">
          {tieneAcceso
            ? "Generá una contraseña nueva si la olvidó. Si cambiás el email, entra con el nuevo."
            : "Todavía no puede entrar a su panel. Creale el acceso con su email."}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(evento) =>
          form.handleSubmit((datos) =>
            tieneAcceso ? setConfirmar(datos) : enviar(datos),
          )(evento)
        }
        className="flex flex-col gap-3"
      >
        <CampoTexto
          control={form.control}
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          variant="outline"
          className="self-start"
          disabled={form.formState.isSubmitting}
        >
          <KeyRound />
          {form.formState.isSubmitting
            ? "Generando…"
            : tieneAcceso
              ? "Generar contraseña nueva"
              : "Crear acceso"}
        </Button>
      </form>

      {acceso && <AccesoCreado acceso={acceso} whatsapp={marca.whatsapp} />}

      <AlertDialog
        open={Boolean(confirmar)}
        onOpenChange={(abierto) => !abierto && setConfirmar(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Generar una contraseña nueva?</AlertDialogTitle>
            <AlertDialogDescription>
              La contraseña actual deja de funcionar y se cierra su sesión en
              todos sus dispositivos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmar) form.handleSubmit(() => enviar(confirmar))();
                setConfirmar(undefined);
              }}
            >
              Generar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function AccesoCreado({
  acceso,
  whatsapp,
}: {
  acceso: AccesoFabricante;
  whatsapp: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const mensaje = [
    "¡Hola! Te paso el acceso a tu panel para cargar productos y ver pedidos.",
    "",
    `Entrá en: ${window.location.origin}/login`,
    `Email: ${acceso.email}`,
    `Contraseña: ${acceso.password}`,
  ].join("\n");

  async function copiar() {
    await navigator.clipboard.writeText(mensaje);
    setCopiado(true);
  }

  return (
    <div className="flex flex-col gap-3 border border-success/30 bg-success/5 p-4">
      <p className="text-sm font-medium">
        Copiá la contraseña ahora: no se vuelve a mostrar.
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Email</dt>
        <dd className="break-all">{acceso.email}</dd>
        <dt className="text-muted-foreground">Contraseña</dt>
        <dd className="font-mono font-semibold break-all">{acceso.password}</dd>
      </dl>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copiar}>
          {copiado ? <Check /> : <Copy />}
          {copiado ? "Copiado" : "Copiar"}
        </Button>
        <Button asChild size="sm">
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle />
            Enviar por WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
