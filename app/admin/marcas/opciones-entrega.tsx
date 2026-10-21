"use client";

import { Loader2, MoreVertical } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { BotonesOrden, idsMovidos } from "@/components/botones-orden";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccion } from "@/hooks/use-accion";
import {
  ETIQUETAS_TIPO_ENTREGA,
  type OpcionEntrega,
} from "@/lib/schemas/opciones-entrega";
import { cn } from "@/lib/utils";
import type { ErrorAccion } from "@/lib/acciones/errores";
import { OpcionEntregaForm } from "./opcion-entrega-form";
import {
  crearOpcion,
  editarOpcion,
  ordenarOpciones,
} from "./opciones-entrega-acciones";

type Props = { marcaId: string; opciones: OpcionEntrega[] };

export function OpcionesEntrega({ marcaId, opciones }: Props) {
  const { pendiente, error, ejecutar } = useAccion();

  function mover(indice: number, desplazamiento: -1 | 1) {
    const ids = idsMovidos(
      opciones.map((opcion) => opcion.id),
      indice,
      desplazamiento,
    );
    ejecutar(() => ordenarOpciones(marcaId, ids));
  }

  return (
    <section className="mb-8 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-bold tracking-wider uppercase">Opciones de entrega</h2>
        <p className="text-sm text-muted-foreground">
          Lo que elige el comprador al hacer el pedido. Con Envío también se le
          piden los datos para mandarlo.
        </p>
      </div>

      {opciones.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay opciones. Agregá al menos una para que el comprador
          pueda elegir cómo recibir su pedido.
        </p>
      ) : (
        <ul
          className={cn("divide-y border-y", pendiente && "opacity-60")}
          aria-busy={pendiente}
        >
          {opciones.map((opcion, i) => (
            <OpcionFila
              key={opcion.id}
              opcion={opcion}
              marcaId={marcaId}
              deshabilitada={pendiente}
              indice={i}
              total={opciones.length}
              onMover={(desplazamiento) => mover(i, desplazamiento)}
              onEjecutar={ejecutar}
            />
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="border p-4">
        <p className="mb-3 text-sm font-medium">Agregar opción</p>
        <OpcionEntregaForm
          textoBoton="Agregar"
          onGuardar={(datos) => crearOpcion(marcaId, datos)}
        />
      </div>
    </section>
  );
}

type FilaProps = {
  opcion: OpcionEntrega;
  marcaId: string;
  deshabilitada: boolean;
  indice: number;
  total: number;
  onMover: (desplazamiento: -1 | 1) => void;
  onEjecutar: (accion: () => Promise<ErrorAccion | undefined>) => void;
};

function OpcionFila({
  opcion,
  marcaId,
  deshabilitada,
  indice,
  total,
  onMover,
  onEjecutar,
}: FilaProps) {
  const [editando, setEditando] = useState(false);

  useLayoutEffect(() => () => setEditando(false), []);

  if (editando) {
    return (
      <li className="py-3">
        <OpcionEntregaForm
          valores={{ nombre: opcion.nombre, tipo: opcion.tipo }}
          textoBoton="Guardar"
          onGuardar={async (datos) => {
            const error = await editarOpcion(marcaId, opcion.id, datos);
            if (!error) setEditando(false);
            return error;
          }}
          onCancelar={() => setEditando(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1 py-2">
      <div className={cn("min-w-0 flex-1", !opcion.activa && "opacity-50")}>
        <p className="truncate font-semibold">{opcion.nombre}</p>
        <p className="text-sm text-muted-foreground">
          {ETIQUETAS_TIPO_ENTREGA[opcion.tipo]}
          {!opcion.activa && " · Oculta"}
        </p>
      </div>
      <BotonesOrden
        nombre={opcion.nombre}
        indice={indice}
        total={total}
        deshabilitado={deshabilitada}
        onMover={onMover}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={deshabilitada}
            aria-label={`Acciones de ${opcion.nombre}`}
          >
            {deshabilitada ? <Loader2 className="animate-spin" /> : <MoreVertical />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditando(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              onEjecutar(() =>
                editarOpcion(marcaId, opcion.id, { activa: !opcion.activa }),
              )
            }
          >
            {opcion.activa ? "Ocultar" : "Mostrar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
