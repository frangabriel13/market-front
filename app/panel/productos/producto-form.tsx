"use client";

import "@/lib/zod-es";
import { zodResolver } from "@hookform/resolvers/zod";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import {
  useForm,
  useWatch,
  type DefaultValues,
  type Path,
} from "react-hook-form";
import { CampoOpciones } from "@/components/form/campo-opciones";
import { CampoPesos } from "@/components/form/campo-pesos";
import { CampoTexto } from "@/components/form/campo-texto";
import { ErrorFormulario } from "@/components/form/error-formulario";
import { Button } from "@/components/ui/button";
import type { ErrorAccion } from "@/lib/acciones/errores";
import type { CategoriaConSubcategorias } from "@/lib/schemas/categorias";
import type { ListasPanel } from "@/lib/schemas/listas";
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
import {
  ajustar,
  matrizDe,
  SIN_ELEGIR,
  variantesDe,
  type Matriz,
  type ValoresDisponibles,
} from "./matriz";
import { guardarVariantes } from "./variantes-acciones";

type Props = {
  producto?: Producto;
  categorias: CategoriaConSubcategorias[];
  listas: ListasPanel;
};

// Si el producto tiene colores y qué lista de talles usa (null: sin talles).
type Modalidad = Pick<ProductoCrear, "listaTallesId"> & { conColores: boolean };

const mismaModalidad = (a: Modalidad, b: Modalidad) =>
  a.conColores === b.conColores && a.listaTallesId === b.listaTallesId;

// Uno nuevo arranca con colores (si la marca los tiene) y la primera lista.
function modalidadInicial(listas: ListasPanel, producto?: Producto): Modalidad {
  if (producto) {
    const { conColores, listaTallesId } = producto;
    return { conColores, listaTallesId };
  }
  const primera = listas.listasTalles[0];
  return {
    conColores: listas.colores.length > 0 || !primera,
    listaTallesId: primera?.id ?? null,
  };
}

function valoresDe(
  listas: ListasPanel,
  { conColores, listaTallesId }: Modalidad,
): ValoresDisponibles {
  const lista = listas.listasTalles.find((l) => l.id === listaTallesId);
  return {
    colores: conColores ? listas.colores.map((c) => c.nombre) : SIN_ELEGIR,
    talles:
      listaTallesId === null
        ? SIN_ELEGIR
        : (lista?.talles.map((t) => t.nombre) ?? []),
  };
}

// Las listas largas se resumen: "35 a 42", "Blanco · Negro · Gris y 4 más".
function resumen(valores: string[], { rango }: { rango: boolean }) {
  if (valores.length <= 4) return valores.join(" · ");
  return rango
    ? `${valores[0]} a ${valores.at(-1)}`
    : `${valores.slice(0, 3).join(" · ")} y ${valores.length - 3} más`;
}

function valoresIniciales(
  modalidad: Modalidad,
  producto?: Producto,
): DefaultValues<ProductoCrearInput> {
  return {
    ...modalidad,
    nombre: producto?.nombre ?? "",
    precio: producto?.precio,
    categoriaId: producto?.categoria.id ?? "",
    descripcion: producto?.descripcion ?? "",
  };
}

// Nada elegido, salvo lo que el producto no tiene (se elige solo).
const matrizVacia = ({ conColores, listaTallesId }: Modalidad): Matriz => ({
  colores: conColores ? [] : SIN_ELEGIR,
  talles: listaTallesId === null ? SIN_ELEGIR : [],
  agotadas: [],
});
const mismaMatriz = (a: Matriz, b: Matriz) =>
  JSON.stringify(variantesDe(a)) === JSON.stringify(variantesDe(b));

export function ProductoForm({ producto, categorias, listas }: Props) {
  const router = useRouter();
  const inicial = modalidadInicial(listas, producto);
  const form = useForm<ProductoCrearInput, unknown, ProductoCrear>({
    resolver: zodResolver(productoCrearSchema),
    defaultValues: valoresIniciales(inicial, producto),
  });
  const { control, formState } = form;
  const [conColores = true, listaTallesId = null] = useWatch({
    control,
    name: ["conColores", "listaTallesId"],
  });
  const modalidad: Modalidad = { conColores, listaTallesId };
  const valores = valoresDe(listas, modalidad);
  const guardada = producto
    ? ajustar(
        matrizDe(producto.variantes, valoresDe(listas, inicial)),
        valoresDe(listas, inicial),
      )
    : matrizVacia(inicial);
  const [matriz, setMatriz] = useState(guardada);
  // Al cambiar la lista o la modalidad hay que volver a marcar la disponibilidad.
  const modalidadCambiada =
    Boolean(producto?.variantes.length) && !mismaModalidad(modalidad, inicial);
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
  // Solo la de uno nuevo: la de uno guardado cambia al guardar y no tiene que
  // disparar el reinicio.
  const { conColores: conColoresInicial, listaTallesId: listaInicial } =
    esNuevo ? inicial : { conColores: true, listaTallesId: null };
  useLayoutEffect(
    () => () => {
      if (!reiniciarAlOcultar.current) return;
      reiniciarAlOcultar.current = false;
      setGuardado(false);
      if (esNuevo) {
        const modalidad = {
          conColores: conColoresInicial,
          listaTallesId: listaInicial,
        };
        form.reset(valoresIniciales(modalidad));
        setMatriz(matrizVacia(modalidad));
        setFotos([]);
      }
    },
    [form, esNuevo, conColoresInicial, listaInicial],
  );


  // Lo de otra lista o modalidad no sirve; al volver a la guardada, vuelve lo
  // que tenía.
  function cambiarModalidad(cambio: Partial<Modalidad>) {
    const nueva = { ...modalidad, ...cambio };
    setGuardado(false);
    setMatriz(
      producto && mismaModalidad(nueva, inicial)
        ? guardada
        : ajustar(matriz, valoresDe(listas, nueva)),
    );
  }

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
      <CampoOpciones
        control={control}
        name="conColores"
        titulo="¿Tiene colores?"
        className="grid grid-cols-2"
        opciones={[
          {
            valor: true,
            titulo: "Con colores",
            detalle:
              resumen(
                listas.colores.map((c) => c.nombre),
                { rango: false },
              ) || "Todavía no cargaste colores",
          },
          {
            valor: false,
            titulo: "Sin colores",
            detalle: "Un solo color o no aplica",
          },
        ]}
        onElegir={(valor) => cambiarModalidad({ conColores: valor })}
      />
      <CampoOpciones
        control={control}
        name="listaTallesId"
        titulo="¿Qué talles usa?"
        opciones={[
          ...listas.listasTalles.map((lista) => ({
            valor: lista.id,
            titulo: lista.nombre,
            detalle:
              resumen(
                lista.talles.map((t) => t.nombre),
                { rango: true },
              ) || "Todavía no tiene talles",
          })),
          {
            valor: null,
            titulo: "Sin talles",
            detalle: "Talle único o no aplica",
          },
        ]}
        onElegir={(valor) => cambiarModalidad({ listaTallesId: valor })}
      />
      {modalidadCambiada && (
        <p role="status" className="border-l-4 border-foreground bg-muted p-3 text-sm">
          Cambiaste los colores o los talles del producto: marcá de nuevo qué
          hay disponible. Lo que tenía queda guardado y vuelve si lo dejás como
          estaba.
        </p>
      )}
      <EditorDisponibilidad
        valores={valores}
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
