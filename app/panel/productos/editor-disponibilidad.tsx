"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  descripcionVariante,
  MAXIMO_TALLES_EN_GRILLA,
} from "@/lib/variantes";
import { RUTA_LISTAS } from "../aviso-listas";
import {
  alternar,
  clave,
  esFijo,
  type Matriz,
  type ValoresDisponibles,
} from "./matriz";

type Props = {
  valores: ValoresDisponibles;
  matriz: Matriz;
  onCambiar: (matriz: Matriz) => void;
};

// Colores y talles salen de las listas del fabricante. Lo que el producto no
// tiene (sin colores o sin talles) no se muestra.
export function EditorDisponibilidad({ valores, matriz, onCambiar }: Props) {
  const conColores = !esFijo(valores.colores);
  const conTalles = !esFijo(valores.talles);
  if (valores.colores.length === 0 || valores.talles.length === 0) {
    return (
      <p className="bg-muted p-3 text-sm text-muted-foreground">
        {valores.colores.length === 0
          ? "Tu marca todavía no tiene colores cargados."
          : "Esta lista todavía no tiene talles."}{" "}
        <Link
          href={RUTA_LISTAS}
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Cargalos en Colores y talles
        </Link>
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

  const enBloques =
    conTalles && matriz.talles.length > MAXIMO_TALLES_EN_GRILLA;

  // `conTalle`: en los bloques no hay encabezado de talles, cada casillero
  // muestra el suyo.
  const celda = (color: string, talle: string, conTalle = false) => {
    const hay = !matriz.agotadas.includes(clave(color, talle));
    return (
      <button
        type="button"
        aria-pressed={hay}
        aria-label={`${descripcionVariante({ color, talle }) || "Producto"}: ${hay ? "hay" : "agotado"}`}
        onClick={() => alternarAgotada(color, talle)}
        className={cn(
          "flex h-12 w-full min-w-14 flex-col items-center justify-center rounded-md text-[10px] font-bold uppercase",
          hay
            ? "bg-foreground text-background"
            : "border border-dashed border-input text-muted-foreground",
        )}
      >
        {conTalle && <span className="text-xs normal-case">{talle}</span>}
        {hay ? "Hay" : "Agotado"}
      </button>
    );
  };

  return (
    <>
      {conColores && (
        <Opciones
          titulo="Colores"
          opciones={valores.colores}
          elegidas={matriz.colores}
          onAlternar={(color) =>
            onCambiar({
              ...matriz,
              colores: alternar(matriz.colores, color, valores.colores),
            })
          }
        />
      )}
      {conTalles && (
        <Opciones
          titulo="Talles"
          opciones={valores.talles}
          elegidas={matriz.talles}
          onAlternar={(talle) =>
            onCambiar({
              ...matriz,
              talles: alternar(matriz.talles, talle, valores.talles),
            })
          }
        />
      )}
      {matriz.colores.length > 0 && matriz.talles.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">¿Qué hay disponible?</p>
          <p className="text-sm text-muted-foreground">
            {conColores || conTalles
              ? "Tocá un casillero para marcarlo como agotado o disponible."
              : "Tocalo para marcar el producto como agotado o disponible."}
          </p>
          {enBloques && (
            <div className="flex flex-col md:hidden">
              {matriz.colores.map((color) => (
                <div
                  key={color}
                  className="flex flex-col gap-2 border-b py-3 last:border-b-0"
                >
                  {conColores && (
                    <p className="text-sm font-semibold">{color}</p>
                  )}
                  <div className="grid grid-cols-5 gap-1.5">
                    {matriz.talles.map((talle) => (
                      <div key={talle}>{celda(color, talle, true)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            className={cn(
              "-mx-4 overflow-x-auto px-3",
              enBloques && "hidden md:block",
            )}
          >
            <table className="w-full border-separate border-spacing-1.5">
              {conTalles && (
                <thead>
                  <tr>
                    {conColores && <td />}
                    {matriz.talles.map((talle) => (
                      <th key={talle} scope="col" className="text-sm font-bold">
                        {talle}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {matriz.colores.map((color) => (
                  <tr key={color}>
                    {conColores && (
                      <th
                        scope="row"
                        className="pr-1 text-left text-sm font-semibold"
                      >
                        {color}
                      </th>
                    )}
                    {matriz.talles.map((talle) => (
                      <td key={talle}>{celda(color, talle)}</td>
                    ))}
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
