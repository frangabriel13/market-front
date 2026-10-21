"use client";

import type { MarcaPanel } from "@/lib/schemas/marcas";
import { cn } from "@/lib/utils";
import { alternar, clave, type Matriz } from "./matriz";

type Props = {
  marca: Pick<MarcaPanel, "colores" | "talles">;
  matriz: Matriz;
  onCambiar: (matriz: Matriz) => void;
};

// Colores y talles salen de las listas de la marca (las carga el administrador).
export function EditorDisponibilidad({ marca, matriz, onCambiar }: Props) {
  if (marca.colores.length === 0 || marca.talles.length === 0) {
    return (
      <p className="bg-muted p-3 text-sm text-muted-foreground">
        Tu marca todavía no tiene colores y talles cargados. Pedíselos al
        administrador.
      </p>
    );
  }

  const alternarAgotada = (color: string, talle: string) => {
    const k = clave(color, talle);
    onCambiar({
      ...matriz,
      agotadas: matriz.agotadas.includes(k)
        ? matriz.agotadas.filter((a) => a !== k)
        : [...matriz.agotadas, k],
    });
  };

  return (
    <>
      <Opciones
        titulo="Colores"
        opciones={marca.colores}
        elegidas={matriz.colores}
        onAlternar={(color) =>
          onCambiar({
            ...matriz,
            colores: alternar(matriz.colores, color, marca.colores),
          })
        }
      />
      <Opciones
        titulo="Talles"
        opciones={marca.talles}
        elegidas={matriz.talles}
        onAlternar={(talle) =>
          onCambiar({
            ...matriz,
            talles: alternar(matriz.talles, talle, marca.talles),
          })
        }
      />
      {matriz.colores.length > 0 && matriz.talles.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">¿Qué hay disponible?</p>
          <p className="text-sm text-muted-foreground">
            Tocá un casillero para marcarlo como agotado o disponible.
          </p>
          <div className="-mx-4 overflow-x-auto px-3">
            <table className="w-full border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <td />
                  {matriz.talles.map((talle) => (
                    <th key={talle} scope="col" className="text-sm font-bold">
                      {talle}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriz.colores.map((color) => (
                  <tr key={color}>
                    <th
                      scope="row"
                      className="pr-1 text-left text-sm font-semibold"
                    >
                      {color}
                    </th>
                    {matriz.talles.map((talle) => {
                      const k = clave(color, talle);
                      const hay = !matriz.agotadas.includes(k);
                      return (
                        <td key={talle}>
                          <button
                            type="button"
                            aria-pressed={hay}
                            aria-label={`${color} ${talle}: ${hay ? "hay" : "agotado"}`}
                            onClick={() => alternarAgotada(color, talle)}
                            className={cn(
                              "flex h-12 w-full min-w-14 items-center justify-center rounded-md text-[10px] font-bold uppercase",
                              hay
                                ? "bg-foreground text-background"
                                : "border border-dashed border-input text-muted-foreground",
                            )}
                          >
                            {hay ? "Hay" : "Agotado"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

type OpcionesProps = {
  titulo: string;
  opciones: string[];
  elegidas: string[];
  onAlternar: (opcion: string) => void;
};

function Opciones({ titulo, opciones, elegidas, onAlternar }: OpcionesProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{titulo}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => {
          const elegida = elegidas.includes(opcion);
          return (
            <button
              key={opcion}
              type="button"
              aria-pressed={elegida}
              onClick={() => onAlternar(opcion)}
              className={cn(
                "h-11 min-w-11 border px-4 text-sm font-semibold",
                elegida
                  ? "border-foreground bg-foreground text-background"
                  : "border-input bg-background text-muted-foreground",
              )}
            >
              {opcion}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
