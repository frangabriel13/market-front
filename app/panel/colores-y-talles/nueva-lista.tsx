"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { Button } from "@/components/ui/button";
import {
  listaTallesCrearSchema,
  type ListaTallesCrear,
  type ListaTallesCrearInput,
} from "@/lib/schemas/listas";
import { crearListaTalles } from "./acciones";

const VACIA: ListaTallesCrearInput = { nombre: "", talles: [] };

// Se crea vacía: los talles se cargan después, en su tarjeta.
// `existentes`: los nombres de las otras listas, para avisar si se repite.
export function NuevaLista({ existentes }: { existentes: string[] }) {
  const form = useForm<ListaTallesCrearInput, unknown, ListaTallesCrear>({
    resolver: zodResolver(listaTallesCrearSchema),
    defaultValues: VACIA,
  });
  const { control, formState } = form;

  // Next oculta la página al navegar sin desmontarla.
  useLayoutEffect(() => () => form.reset(VACIA), [form]);

  async function onSubmit(datos: ListaTallesCrear) {
    const nombre = datos.nombre.toLowerCase();
    if (existentes.some((e) => e.toLowerCase() === nombre)) {
      return form.setError("nombre", {
        message: "Ya tenés una lista con ese nombre",
      });
    }
    const resultado = await crearListaTalles(datos);
    if (!resultado) return form.reset(VACIA);
    form.setError(resultado.campos?.nombre ? "nombre" : "root", {
      message: resultado.error,
    });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 border border-dashed bg-background p-4"
    >
      <CampoTexto
        control={control}
        name="nombre"
        label={
          existentes.length === 0
            ? "Nombre de tu primera lista"
            : "Nueva lista de talles"
        }
        placeholder="Ej. Ropa, Calzado"
        maxLength={40}
      />
      {formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {formState.errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        variant="outline"
        className="self-start"
        disabled={formState.isSubmitting}
      >
        <Plus />
        {formState.isSubmitting ? "Creando…" : "Crear lista"}
      </Button>
    </form>
  );
}
