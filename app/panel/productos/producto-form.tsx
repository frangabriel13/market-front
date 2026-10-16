"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { CampoPesos } from "@/components/form/campo-pesos";
import { CampoTexto } from "@/components/form/campo-texto";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import type { ErrorAccion } from "@/lib/acciones/errores";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import {
  productoCrearSchema,
  type Producto,
  type ProductoCrear,
  type ProductoCrearInput,
} from "@/lib/schemas/productos";
import { crearProducto, editarProducto } from "./acciones";
import { CampoCategoria } from "./campo-categoria";

type Props = {
  producto?: Producto;
  categorias: CategoriaConSubcategorias[];
};

function valoresIniciales(
  producto?: Producto,
): DefaultValues<ProductoCrearInput> {
  return {
    nombre: producto?.nombre ?? "",
    precio: producto?.precio,
    categoriaId: producto?.categoria.id ?? "",
    descripcion: producto?.descripcion ?? "",
  };
}

export function ProductoForm({ producto, categorias }: Props) {
  const form = useForm<ProductoCrearInput, unknown, ProductoCrear>({
    resolver: zodResolver(productoCrearSchema),
    defaultValues: valoresIniciales(producto),
  });
  const { control, formState } = form;
  const [guardado, setGuardado] = useState(false);
  // Al crear: true = "Publicar", false = "Guardar sin publicar". La ref la
  // lee el envío (corre en el mismo evento del click); el estado, los textos.
  const publicar = useRef(true);
  const [publicando, setPublicando] = useState(true);

  // Next oculta la página al navegar sin desmontarla: después de guardar,
  // que al volver no aparezcan el aviso viejo ni (al crear) los datos anteriores.
  const reiniciarAlOcultar = useRef(false);
  const esNuevo = !producto;
  useLayoutEffect(
    () => () => {
      if (!reiniciarAlOcultar.current) return;
      reiniciarAlOcultar.current = false;
      setGuardado(false);
      if (esNuevo) form.reset(valoresIniciales());
    },
    [form, esNuevo],
  );

  function mostrarError({ error, campos }: ErrorAccion) {
    reiniciarAlOcultar.current = false;
    form.setError("root", { message: error });
    for (const [campo, mensaje] of Object.entries(campos ?? {})) {
      form.setError(campo as Path<ProductoCrearInput>, { message: mensaje });
    }
  }

  async function onSubmit(datos: ProductoCrear) {
    setGuardado(false);
    reiniciarAlOcultar.current = true;
    try {
      const error = producto
        ? await editarProducto(producto.id, datos)
        : await crearProducto({ ...datos, visible: publicar.current });
      if (error) return mostrarError(error);
      form.reset(form.getValues());
      setGuardado(true);
    } catch (error) {
      unstable_rethrow(error);
      mostrarError({ error: "No pudimos guardar el producto. Probá de nuevo." });
    }
  }

  function enviar(publicarAhora: boolean) {
    publicar.current = publicarAhora;
    setPublicando(publicarAhora);
  }

  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(onSubmit)(evento)}
      className="flex flex-col gap-5"
    >
      <CampoTexto
        control={control}
        name="nombre"
        label="Nombre"
        maxLength={120}
      />
      <CampoPesos control={control} name="precio" label="Precio" />
      <CampoCategoria control={control} categorias={categorias} />
      <CampoTexto
        control={control}
        name="descripcion"
        label="Descripción (opcional)"
        multilinea
        maxLength={2000}
      />

      {formState.errors.root && (
        <ErrorFormulario>{formState.errors.root.message}</ErrorFormulario>
      )}
      {guardado && !formState.isDirty && (
        <p role="status" className="text-sm text-success">
          Guardamos los cambios.
        </p>
      )}

      {producto ? (
        <Button type="submit" size="lg" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={formState.isSubmitting}
            onClick={() => enviar(true)}
          >
            {formState.isSubmitting && publicando ? "Publicando…" : "Publicar"}
          </Button>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            disabled={formState.isSubmitting}
            onClick={() => enviar(false)}
          >
            {formState.isSubmitting && !publicando
              ? "Guardando…"
              : "Guardar sin publicar"}
          </Button>
        </div>
      )}
    </form>
  );
}
