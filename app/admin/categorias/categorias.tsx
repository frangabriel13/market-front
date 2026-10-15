"use client";

import { Loader2, MoreVertical, Plus } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { BotonesOrden, idsMovidos } from "@/components/botones-orden";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccion } from "@/hooks/use-accion";
import type {
  Categoria,
  CategoriaConSubcategorias,
} from "@/lib/schemas/categorias";
import { cn } from "@/lib/utils";
import {
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
  ordenarCategorias,
} from "./acciones";
import { NombreForm } from "./nombre-form";

type Ejecutar = ReturnType<typeof useAccion>["ejecutar"];

export function Categorias({
  categorias,
}: {
  categorias: CategoriaConSubcategorias[];
}) {
  const { pendiente, error, ejecutar } = useAccion();

  return (
    <div className="flex flex-col gap-4">
      {categorias.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Todavía no hay categorías.
        </p>
      ) : (
        <ul
          className={cn("divide-y border-y", pendiente && "opacity-60")}
          aria-busy={pendiente}
        >
          {categorias.map((categoria, i) => (
            <li key={categoria.id} className="py-1">
              <CategoriaFila
                categoria={categoria}
                hermanas={categorias}
                indice={i}
                pendiente={pendiente}
                ejecutar={ejecutar}
              />
              <Subcategorias
                padre={categoria}
                pendiente={pendiente}
                ejecutar={ejecutar}
              />
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="border p-4">
        <NombreForm
          label="Nueva categoría"
          textoBoton="Agregar"
          onGuardar={(nombre) => crearCategoria({ nombre })}
        />
      </div>
    </div>
  );
}

type GrupoProps = {
  padre: CategoriaConSubcategorias;
  pendiente: boolean;
  ejecutar: Ejecutar;
};

function Subcategorias({ padre, pendiente, ejecutar }: GrupoProps) {
  const [agregando, setAgregando] = useState(false);

  useLayoutEffect(() => () => setAgregando(false), []);

  return (
    <div className="mb-2 ml-3 border-l pl-3">
      {padre.subcategorias.length > 0 && (
        <ul>
          {padre.subcategorias.map((sub, i) => (
            <li key={sub.id}>
              <CategoriaFila
                categoria={sub}
                hermanas={padre.subcategorias}
                indice={i}
                pendiente={pendiente}
                ejecutar={ejecutar}
              />
            </li>
          ))}
        </ul>
      )}
      {agregando ? (
        <div className="py-2">
          <NombreForm
            label={`Nueva subcategoría de ${padre.nombre}`}
            textoBoton="Agregar"
            onGuardar={async (nombre) => {
              const error = await crearCategoria({ nombre, padreId: padre.id });
              if (!error) setAgregando(false);
              return error;
            }}
            onCancelar={() => setAgregando(false)}
          />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setAgregando(true)}
        >
          <Plus />
          Subcategoría
        </Button>
      )}
    </div>
  );
}

type FilaProps = {
  categoria: Categoria;
  hermanas: Categoria[];
  indice: number;
  pendiente: boolean;
  ejecutar: Ejecutar;
};

function CategoriaFila({
  categoria,
  hermanas,
  indice,
  pendiente,
  ejecutar,
}: FilaProps) {
  const [editando, setEditando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const esSubcategoria = Boolean(categoria.padreId);

  useLayoutEffect(() => () => setEditando(false), []);

  if (editando) {
    return (
      <div className="py-2">
        <NombreForm
          label="Nombre"
          nombre={categoria.nombre}
          textoBoton="Guardar"
          onGuardar={async (nombre) => {
            const error = await editarCategoria(categoria.id, { nombre });
            if (!error) setEditando(false);
            return error;
          }}
          onCancelar={() => setEditando(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 py-1">
      <p
        className={cn(
          "min-w-0 flex-1 truncate",
          esSubcategoria ? "text-sm" : "font-semibold",
        )}
      >
        {categoria.nombre}
      </p>
      <BotonesOrden
        nombre={categoria.nombre}
        indice={indice}
        total={hermanas.length}
        deshabilitado={pendiente}
        onMover={(desplazamiento) =>
          ejecutar(() =>
            ordenarCategorias(
              idsMovidos(
                hermanas.map((hermana) => hermana.id),
                indice,
                desplazamiento,
              ),
            ),
          )
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={pendiente}
            aria-label={`Acciones de ${categoria.nombre}`}
          >
            {pendiente ? <Loader2 className="animate-spin" /> : <MoreVertical />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditando(true)}>
            Cambiar nombre
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmarBorrado(true)}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmarBorrado} onOpenChange={setConfirmarBorrado}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar {categoria.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Solo se puede eliminar si no tiene subcategorías ni productos
              cargados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => ejecutar(() => eliminarCategoria(categoria.id))}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
