"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { useForm, type DefaultValues, type Path } from "react-hook-form";
import { CampoPesos } from "@/components/form/campo-pesos";
import { CampoTexto } from "@/components/form/campo-texto";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import type { ErrorAccion } from "@/lib/acciones/errores";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import type { MarcaPanel } from "@/lib/schemas/marcas";
import {
  productoCrearSchema,
  type Producto,
  type ProductoCrear,
  type ProductoCrearInput,
} from "@/lib/schemas/productos";
import { subirImagen } from "@/lib/subir-imagen";
import { crearProducto, editarProducto } from "./acciones";
import { CampoCategoria } from "./campo-categoria";
import { EditorDisponibilidad } from "./editor-disponibilidad";
import { pedirUrlDeFoto, registrarFoto } from "./fotos-acciones";
import { FotosNuevas } from "./fotos-nuevas";
import { matrizDe, variantesDe, type Matriz } from "./matriz";
import { guardarVariantes } from "./variantes-acciones";

type Props = {
  producto?: Producto;
  categorias: CategoriaConSubcategorias[];
  marca: Pick<MarcaPanel, "colores" | "talles">;
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

const MATRIZ_VACIA: Matriz = { colores: [], talles: [], agotadas: [] };
const mismaMatriz = (a: Matriz, b: Matriz) =>
  JSON.stringify(variantesDe(a)) === JSON.stringify(variantesDe(b));

export function ProductoForm({ producto, categorias, marca }: Props) {
  const router = useRouter();
  const form = useForm<ProductoCrearInput, unknown, ProductoCrear>({
    resolver: zodResolver(productoCrearSchema),
    defaultValues: valoresIniciales(producto),
  });
  const { control, formState } = form;
  const guardada = producto
    ? matrizDe(producto.variantes, marca)
    : MATRIZ_VACIA;
  const [matriz, setMatriz] = useState(guardada);
  const [fotos, setFotos] = useState<File[]>([]);
  const [paso, setPaso] = useState<string>();
  const [guardado, setGuardado] = useState(false);
  // Al crear: true = "Publicar", false = "Guardar sin publicar". La ref la
  // lee el envío (corre en el mismo evento del click); el estado, los textos.
  const publicar = useRef(true);
  const [publicando, setPublicando] = useState(true);
  const cambiosEnMatriz = !mismaMatriz(matriz, guardada);

  // Next oculta la página al navegar sin desmontarla: después de guardar,
  // que al volver no aparezcan el aviso viejo ni (al crear) los datos anteriores.
  const reiniciarAlOcultar = useRef(false);
  const esNuevo = !producto;
  useLayoutEffect(
    () => () => {
      if (!reiniciarAlOcultar.current) return;
      reiniciarAlOcultar.current = false;
      setGuardado(false);
      if (esNuevo) {
        form.reset(valoresIniciales());
        setMatriz(MATRIZ_VACIA);
        setFotos([]);
      }
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

  async function editar(id: string, datos: ProductoCrear) {
    const error =
      (await editarProducto(id, datos)) ??
      (cambiosEnMatriz
        ? await guardarVariantes(id, variantesDe(matriz))
        : undefined);
    if (error) return mostrarError(error);
    form.reset(form.getValues());
    setGuardado(true);
  }

  // Si algo falla después de crearlo, se sigue en su edición para completarlo.
  async function crear(datos: ProductoCrear) {
    const creado = await crearProducto({ ...datos, visible: publicar.current });
    if ("error" in creado) return mostrarError(creado);
    const errores: string[] = [];
    for (const [i, archivo] of fotos.entries()) {
      setPaso(`Subiendo foto ${i + 1} de ${fotos.length}…`);
      const subida = await subirImagen(archivo, (d) =>
        pedirUrlDeFoto(creado.id, d),
      );
      const error =
        "error" in subida ? subida : await registrarFoto(creado.id, subida.url);
      if (error) errores.push(error.error);
    }
    const variantes = variantesDe(matriz);
    if (variantes.length > 0) {
      setPaso("Guardando la disponibilidad…");
      const error = await guardarVariantes(creado.id, variantes);
      if (error) errores.push(error.error);
    }
    router.push(
      errores.length > 0
        ? `/panel/productos/${creado.id}?incompleto=1`
        : "/panel",
    );
  }

  async function onSubmit(datos: ProductoCrear) {
    setGuardado(false);
    reiniciarAlOcultar.current = true;
    try {
      await (producto ? editar(producto.id, datos) : crear(datos));
    } catch (error) {
      unstable_rethrow(error);
      mostrarError({ error: "No pudimos guardar el producto. Probá de nuevo." });
    } finally {
      setPaso(undefined);
    }
  }

  function enviar(publicarAhora: boolean) {
    publicar.current = publicarAhora;
    setPublicando(publicarAhora);
  }

  const ocupado = formState.isSubmitting;
  const sinCambios =
    Boolean(producto) && !formState.isDirty && !cambiosEnMatriz;

  return (
    <form
      noValidate
      onSubmit={(evento) => form.handleSubmit(onSubmit)(evento)}
      className="flex flex-col gap-5"
    >
      {esNuevo && (
        <FotosNuevas archivos={fotos} onCambiar={setFotos} disabled={ocupado} />
      )}
      <CampoTexto
        control={control}
        name="nombre"
        label="Nombre del producto"
        maxLength={120}
      />
      <div className="grid grid-cols-2 gap-3">
        <CampoPesos control={control} name="precio" label="Precio" />
        <CampoCategoria control={control} categorias={categorias} />
      </div>
      <EditorDisponibilidad
        marca={marca}
        matriz={matriz}
        onCambiar={(nueva) => {
          setGuardado(false);
          setMatriz(nueva);
        }}
      />
      <CampoTexto
        control={control}
        name="descripcion"
        label="Descripción (opcional)"
        placeholder="Material, corte, estampado"
        multilinea
        maxLength={2000}
      />

      {formState.errors.root && (
        <ErrorFormulario>{formState.errors.root.message}</ErrorFormulario>
      )}

      <div className="sticky bottom-0 -mx-4 flex flex-col items-center gap-2 border-t bg-background px-4 py-3">
        {guardado && sinCambios && (
          <p role="status" className="text-sm text-success">
            Guardamos los cambios.
          </p>
        )}
        {producto ? (
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={ocupado || sinCambios}
          >
            {ocupado ? "Guardando…" : "Guardar cambios"}
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={ocupado}
              onClick={() => enviar(true)}
            >
              {ocupado && publicando
                ? (paso ?? "Publicando…")
                : "Publicar producto"}
            </Button>
            <button
              type="submit"
              disabled={ocupado}
              onClick={() => enviar(false)}
              className="py-1 text-sm font-semibold underline underline-offset-4 disabled:opacity-50"
            >
              {ocupado && !publicando
                ? (paso ?? "Guardando…")
                : "Guardar sin publicar"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
