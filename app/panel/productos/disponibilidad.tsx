"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAccion } from "@/hooks/use-accion";
import type { MarcaPanel } from "@/lib/schemas/marcas";
import type { VarianteProducto } from "@/lib/schemas/productos";
import { cn } from "@/lib/utils";
import { alternar, clave, matrizDe, variantesDe, type Matriz } from "./matriz";
import { guardarVariantes } from "./variantes-acciones";

type Props = {
  productoId: string;
  variantes: VarianteProducto[];
  marca: Pick<MarcaPanel, "colores" | "talles">;
};

export function Disponibilidad({ productoId, variantes, marca }: Props) {
  const inicial = matrizDe(variantes, marca);
  const [matriz, setMatriz] = useState<Matriz>(inicial);
  const [guardado, setGuardado] = useState(false);
  const { pendiente, error, ejecutar } = useAccion();
  const cambios =
    JSON.stringify(variantesDe(matriz)) !== JSON.stringify(variantesDe(inicial));

  useLayoutEffect(() => () => setGuardado(false), []);

  function cambiar(nueva: Matriz) {
    setGuardado(false);
    setMatriz(nueva);
  }

  function guardar() {
    ejecutar(async () => {
      const resultado = await guardarVariantes(productoId, variantesDe(matriz));
      if (!resultado) setGuardado(true);
      return resultado;
    });
  }

  if (marca.colores.length === 0 || marca.talles.length === 0) {
    return (
      <Seccion>
        <p className="text-sm text-muted-foreground">
          Tu marca todavía no tiene colores y talles cargados. Pedíselos al
          administrador.
        </p>
      </Seccion>
    );
  }

  return (
    <Seccion>
      <p className="text-sm text-muted-foreground">
        Elegí los que tiene este producto y marcá los que están agotados.
      </p>

      <Opciones
        titulo="Colores"
        opciones={marca.colores}
        elegidas={matriz.colores}
        onAlternar={(color) =>
          cambiar({
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
          cambiar({
            ...matriz,
            talles: alternar(matriz.talles, talle, marca.talles),
          })
        }
      />

      {matriz.colores.length > 0 && matriz.talles.length > 0 && (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium">Disponibilidad</p>
            <p className="text-xs text-muted-foreground">
              Tocá un talle para marcarlo agotado. Negro: hay. Tachado: agotado.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {matriz.colores.map((color) => (
              <li key={color}>
                <p className="mb-1.5 text-sm">{color}</p>
                <div className="flex flex-wrap gap-2">
                  {matriz.talles.map((talle) => {
                    const k = clave(color, talle);
                    const hay = !matriz.agotadas.includes(k);
                    return (
                      <button
                        key={talle}
                        type="button"
                        aria-pressed={hay}
                        aria-label={`${color} ${talle}: ${hay ? "hay" : "agotado"}`}
                        onClick={() =>
                          cambiar({
                            ...matriz,
                            agotadas: hay
                              ? [...matriz.agotadas, k]
                              : matriz.agotadas.filter((a) => a !== k),
                          })
                        }
                        className={cn(
                          "h-10 min-w-12 border px-3 text-sm font-medium",
                          hay
                            ? "border-foreground bg-foreground text-background"
                            : "bg-muted text-muted-foreground line-through",
                        )}
                      >
                        {talle}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {guardado && !cambios && (
        <p role="status" className="text-sm text-success">
          Guardamos la disponibilidad.
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        disabled={!cambios || pendiente}
        onClick={guardar}
      >
        {pendiente ? "Guardando…" : "Guardar disponibilidad"}
      </Button>
    </Seccion>
  );
}

function Seccion({ children }: { children: ReactNode }) {
  return (
    <section className="mb-8 flex flex-col gap-4">
      <h2 className="text-base font-medium">Colores y talles</h2>
      {children}
    </section>
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
    <div>
      <p className="mb-1.5 text-sm font-medium">{titulo}</p>
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
                "h-9 border px-3 text-sm",
                elegida
                  ? "border-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {opcion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
