"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/form/campo-texto";
import { Button } from "@/components/ui/button";
import { formatearFecha } from "@/lib/formato";
import {
  ETIQUETAS_TEXTO_LEGAL,
  textoLegalEditarSchema,
  type TextoLegal,
  type TextoLegalEditar,
} from "@/lib/schemas/legales";
import { guardarTextoLegal } from "./acciones";

export function TextoLegalForm({ texto }: { texto: TextoLegal }) {
  const form = useForm<TextoLegalEditar>({
    resolver: zodResolver(textoLegalEditarSchema),
    defaultValues: { contenido: texto.contenido },
  });
  const [guardado, setGuardado] = useState(false);
  const limpiarAlOcultar = useRef(false);

  useLayoutEffect(
    () => () => {
      if (!limpiarAlOcultar.current) return;
      limpiarAlOcultar.current = false;
      setGuardado(false);
    },
    [],
  );

  async function guardar(datos: TextoLegalEditar) {
    setGuardado(false);
    let error: string | undefined;
    try {
      const resultado = await guardarTextoLegal(texto.tipo, datos);
      error = resultado && (resultado.campos?.contenido ?? resultado.error);
    } catch (e) {
      unstable_rethrow(e);
      error = "No pudimos guardar el texto. Probá de nuevo.";
    }
    if (error) return form.setError("contenido", { message: error });
    form.reset(datos);
    setGuardado(true);
    limpiarAlOcultar.current = true;
  }

  const titulo = ETIQUETAS_TEXTO_LEGAL[texto.tipo];
  const publicado = texto.contenido !== "";
  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(guardar)(evento)}
      className="flex flex-col gap-3"
    >
      <div>
        <h2 className="text-base font-medium">{titulo}</h2>
        <p className="text-sm text-muted-foreground">
          {publicado && texto.actualizadoEn
            ? `Publicado. Última actualización: ${formatearFecha(texto.actualizadoEn)}.`
            : "Sin publicar: no aparece en las tiendas."}
        </p>
      </div>
      <CampoTexto
        control={form.control}
        name="contenido"
        label="Texto"
        descripcion="Si lo dejás vacío, deja de aparecer en las tiendas."
        multilinea
        maxLength={50_000}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando…" : "Guardar"}
        </Button>
        {guardado && !form.formState.isDirty && (
          <p role="status" className="text-sm text-success">
            Guardamos los cambios.
          </p>
        )}
      </div>
    </form>
  );
}
