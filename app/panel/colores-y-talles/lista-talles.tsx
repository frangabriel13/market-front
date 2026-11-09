"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CampoImagen } from "@/components/form/campo-imagen";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAccion } from "@/hooks/use-accion";
import type { ListaTallesPanel } from "@/lib/schemas/listas";
import { subirImagen } from "@/lib/subir-imagen";
import {
  editarListaTalles,
  eliminarListaTalles,
  pedirUrlDeGuia,
} from "./acciones";
import { EdicionEnLinea } from "./edicion-en-linea";
import { EditorValores } from "./editor-valores";
import { productos } from "./textos";

type Props = {
  lista: ListaTallesPanel;
  // Los nombres de las otras listas, para avisar si se repite.
  otras: string[];
};

export function ListaTalles({ lista, otras }: Props) {
  const editar = (datos: Parameters<typeof editarListaTalles>[1]) =>
    editarListaTalles(lista.id, datos);

  return (
    <section className="flex flex-col gap-4 border bg-background p-4">
      <Encabezado lista={lista} otras={otras} />
      <EditorValores
        nombre="talle"
        placeholder="Ej. M"
        valores={lista.talles}
        onGuardar={(talles) => editar({ talles })}
      />
      <CampoImagen
        titulo="Guía de talles"
        descripcion="Una imagen con la tabla de medidas. Se ve en los productos de esta lista."
        marco="aspect-[3/4]"
        url={lista.guiaTallesUrl}
        subir={async (archivo) => {
          const subida = await subirImagen(archivo, (datos) =>
            pedirUrlDeGuia(lista.id, datos),
          );
          return "error" in subida
            ? subida
            : editar({ guiaTallesUrl: subida.url });
        }}
        quitar={() => editar({ guiaTallesUrl: null })}
      />
      <BorrarLista lista={lista} />
    </section>
  );
}

function Encabezado({ lista, otras }: Props) {
  const { pendiente, error, ejecutar } = useAccion();
  const [editando, setEditando] = useState(false);

  const uso =
    lista.productos > 0
      ? `La usan ${productos(lista.productos)}`
      : "Todavía no la usa ningún producto";

  if (editando) {
    return (
      <div className="flex flex-col gap-1">
        <EdicionEnLinea
          etiqueta={`Nuevo nombre de la lista ${lista.nombre}`}
          inicial={lista.nombre}
          maxLength={40}
          pendiente={pendiente}
          validar={(texto) => {
            if (!texto) return "Escribí el nombre de la lista";
            if (otras.some((o) => o.toLowerCase() === texto.toLowerCase())) {
              return "Ya tenés una lista con ese nombre";
            }
          }}
          onGuardar={(nombre) =>
            ejecutar(async () => {
              const resultado = await editarListaTalles(lista.id, { nombre });
              if (!resultado) setEditando(false);
              return resultado;
            })
          }
          onCancelar={() => setEditando(false)}
        />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-black">{lista.nombre}</h3>
        <p className="text-sm text-muted-foreground">{uso}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setEditando(true)}
        aria-label={`Cambiar el nombre de la lista ${lista.nombre}`}
      >
        <Pencil />
      </Button>
    </div>
  );
}

function BorrarLista({ lista }: { lista: ListaTallesPanel }) {
  const { pendiente, error, ejecutar } = useAccion();

  if (lista.productos > 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Para borrar esta lista, primero cambiales la lista de talles a{" "}
        {lista.productos === 1
          ? "su producto"
          : `sus ${lista.productos} productos`}
        .
      </p>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="self-start">
          <Trash2 />
          Borrar lista
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Borrar la lista {lista.nombre}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borra con sus talles y su guía. No la usa ningún producto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pendiente}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={pendiente}
            onClick={() => ejecutar(() => eliminarListaTalles(lista.id))}
          >
            {pendiente ? "Borrando…" : "Borrar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
