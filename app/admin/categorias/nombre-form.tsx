"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { Button } from "@/components/ui/button";
import { categoriaCrearSchema } from "@/lib/schemas/categorias";
import type { ErrorAccion } from "../errores";

const nombreSchema = categoriaCrearSchema.pick({ nombre: true });
type Nombre = { nombre: string };

type Props = {
  label: string;
  nombre?: string;
  textoBoton: string;
  onGuardar: (nombre: string) => Promise<ErrorAccion | undefined>;
  onCancelar?: () => void;
};

export function NombreForm({
  label,
  nombre = "",
  textoBoton,
  onGuardar,
  onCancelar,
}: Props) {
  const form = useForm<Nombre>({
    resolver: zodResolver(nombreSchema),
    defaultValues: { nombre },
  });

  async function guardar(datos: Nombre) {
    const error = await onGuardar(datos.nombre);
    if (!error) return form.reset();
    form.setError("nombre", {
      message: error.campos?.nombre ?? error.error,
    });
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
        label={label}
        maxLength={60}
        autoFocus={Boolean(onCancelar)}
      />
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
