"use client";

import { Pencil, X } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { BotonesOrden } from "@/components/botones-orden";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAccion } from "@/hooks/use-accion";
import type { ErrorAccion } from "@/lib/acciones/errores";
import {
  MAXIMO_VALORES,
  type ValorEditado,
  type ValorEnUso,
} from "@/lib/schemas/listas";
import { EdicionEnLinea } from "./edicion-en-linea";
import { productos } from "./textos";

type Props = {
  // En singular y minúscula: "color", "talle".
  nombre: string;
  placeholder: string;
  valores: ValorEnUso[];
  onGuardar: (valores: ValorEditado[]) => Promise<ErrorAccion | undefined>;
};

// Cada cambio guarda la lista entera. `anterior` lleva el nombre guardado:
// así la API sabe qué se renombró y lo cambia en los productos.
export function EditorValores({ nombre, placeholder, valores, onGuardar }: Props) {
  const { pendiente, error, ejecutar } = useAccion();
  const [editando, setEditando] = useState<string>();
  const [aQuitar, setAQuitar] = useState<ValorEnUso>();
  // Cambia después de agregar, para vaciar el campo.
  const [agregados, setAgregados] = useState(0);

  // Next oculta la página al navegar sin desmontarla.
  useLayoutEffect(
    () => () => {
      setEditando(undefined);
      setAQuitar(undefined);
    },
    [],
  );

  const guardados: ValorEditado[] = valores.map((v) => ({
    nombre: v.nombre,
    anterior: v.nombre,
  }));

  function guardar(lista: ValorEditado[], alGuardar: () => void) {
    ejecutar(async () => {
      const resultado = await onGuardar(lista);
      if (!resultado) alGuardar();
      return resultado;
    });
  }

  function validar(texto: string, excepto?: string) {
    if (!texto) return `Escribí el ${nombre}`;
    const repetido = valores.find(
      (v) =>
        v.nombre !== excepto && v.nombre.toLowerCase() === texto.toLowerCase(),
    );
    if (repetido) return `${repetido.nombre} ya está en la lista`;
  }

  function quitar(valor: ValorEnUso) {
    guardar(
      guardados.filter((v) => v.anterior !== valor.nombre),
      () => setAQuitar(undefined),
    );
  }

  function mover(indice: number, desplazamiento: -1 | 1) {
    const lista = [...guardados];
    const destino = indice + desplazamiento;
    [lista[indice], lista[destino]] = [lista[destino], lista[indice]];
    guardar(lista, () => {});
  }

  return (
    <div className="flex flex-col gap-3">
      {valores.length > 0 && (
        <ul className="flex flex-col divide-y border">
          {valores.map((valor, indice) =>
            editando === valor.nombre ? (
              <li key={valor.nombre} className="p-2">
                <EdicionEnLinea
                  etiqueta={`Nuevo nombre de ${valor.nombre}`}
                  inicial={valor.nombre}
                  maxLength={30}
                  pendiente={pendiente}
                  validar={(texto) => validar(texto, valor.nombre)}
                  onGuardar={(texto) =>
                    texto === valor.nombre
                      ? setEditando(undefined)
                      : guardar(
                          guardados.map((v) =>
                            v.anterior === valor.nombre
                              ? { ...v, nombre: texto }
                              : v,
                          ),
                          () => setEditando(undefined),
                        )
                  }
                  onCancelar={() => setEditando(undefined)}
                />
              </li>
            ) : (
              <li key={valor.nombre} className="flex items-center gap-1 py-1 pl-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{valor.nombre}</p>
                  {valor.productos > 0 && (
                    <p className="text-xs text-muted-foreground">
                      En {productos(valor.productos)}
                    </p>
                  )}
                </div>
                <BotonesOrden
                  nombre={valor.nombre}
                  indice={indice}
                  total={valores.length}
                  deshabilitado={pendiente}
                  onMover={(desplazamiento) => mover(indice, desplazamiento)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pendiente}
                  onClick={() => setEditando(valor.nombre)}
                  aria-label={`Cambiar el nombre de ${valor.nombre}`}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pendiente}
                  onClick={() =>
                    valor.productos > 0 ? setAQuitar(valor) : quitar(valor)
                  }
                  aria-label={`Quitar ${valor.nombre}`}
                >
                  <X />
                </Button>
              </li>
            ),
          )}
        </ul>
      )}

      {valores.length < MAXIMO_VALORES ? (
        <EdicionEnLinea
          key={agregados}
          etiqueta={`Agregar ${nombre}`}
          placeholder={placeholder}
          maxLength={30}
          pendiente={pendiente}
          validar={(texto) => validar(texto)}
          onGuardar={(texto) =>
            guardar([...guardados, { nombre: texto }], () =>
              setAgregados((n) => n + 1),
            )
          }
          textoBoton="Agregar"
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Llegaste al máximo de {MAXIMO_VALORES}.
        </p>
      )}

      {error && !aQuitar && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <AlertDialog
        open={Boolean(aQuitar)}
        onOpenChange={(abierto) => !abierto && setAQuitar(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar {aQuitar?.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              {aQuitar && avisoAlQuitar(aQuitar.productos)}
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
              onClick={() => aQuitar && quitar(aQuitar)}
            >
              {pendiente ? "Quitando…" : "Quitar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function avisoAlQuitar(cantidad: number) {
  const usan = cantidad === 1 ? "Lo usa 1 producto" : `Lo usan ${cantidad} productos`;
  const donde = cantidad === 1 ? "ese producto" : "esos productos";
  return `${usan}. Deja de mostrarse en ${donde} y en la tienda. Si lo volvés a agregar con el mismo nombre, vuelve con la disponibilidad que tenía.`;
}
