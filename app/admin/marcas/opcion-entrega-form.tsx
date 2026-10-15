"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Path } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { Button } from "@/components/ui/button";
import {
  ETIQUETAS_TIPO_ENTREGA,
  opcionEntregaCrearSchema,
  TIPOS_ENTREGA,
  type OpcionEntregaCrear,
  type OpcionEntregaCrearInput,
} from "@/lib/schemas/opciones-entrega";
import { cn } from "@/lib/utils";
import type { ErrorAccion } from "../errores";

type Props = {
  valores?: OpcionEntregaCrearInput;
  textoBoton: string;
  onGuardar: (datos: OpcionEntregaCrear) => Promise<ErrorAccion | undefined>;
  onCancelar?: () => void;
};

export function OpcionEntregaForm({
  valores = { nombre: "", tipo: "RETIRO" },
  textoBoton,
  onGuardar,
  onCancelar,
}: Props) {
  const form = useForm<OpcionEntregaCrearInput, unknown, OpcionEntregaCrear>({
    resolver: zodResolver(opcionEntregaCrearSchema),
    defaultValues: valores,
  });

  async function guardar(datos: OpcionEntregaCrear) {
    const error = await onGuardar(datos);
    if (!error) return form.reset();
    form.setError("root", { message: error.error });
    for (const [campo, mensaje] of Object.entries(error.campos ?? {})) {
      form.setError(campo as Path<OpcionEntregaCrearInput>, { message: mensaje });
    }
  }

  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(guardar)(evento)}
      className="flex flex-col gap-3"
    >
      <CampoTexto
        control={form.control}
        name="nombre"
        label="Nombre"
        maxLength={80}
        placeholder="Ej. Expreso a domicilio"
      />
      <Controller
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <div role="radiogroup" aria-label="Tipo" className="flex">
            {TIPOS_ENTREGA.map((tipo) => (
              <button
                key={tipo}
                type="button"
                role="radio"
                aria-checked={field.value === tipo}
                onClick={() => field.onChange(tipo)}
                className={cn(
                  "h-10 flex-1 border text-sm font-medium transition-colors first:border-r-0",
                  field.value === tipo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted",
                )}
              >
                {ETIQUETAS_TIPO_ENTREGA[tipo]}
              </button>
            ))}
          </div>
        )}
      />
      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando…" : textoBoton}
        </Button>
        {onCancelar && (
          <Button type="button" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
