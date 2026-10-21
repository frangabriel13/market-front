"use client";

import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MAXIMO_FOTOS } from "@/lib/schemas/productos";
import { ElegirFotos } from "./elegir-fotos";

type Props = {
  archivos: File[];
  onCambiar: (archivos: File[]) => void;
  disabled?: boolean;
};

// Al crear, las fotos esperan en el navegador: se suben cuando el producto
// ya existe (la API las guarda en su carpeta).
export function FotosNuevas({ archivos, onCambiar, disabled }: Props) {
  const vistas = useMemo(
    () => archivos.map((archivo) => URL.createObjectURL(archivo)),
    [archivos],
  );
  useEffect(() => () => vistas.forEach(URL.revokeObjectURL), [vistas]);
  const lugares = MAXIMO_FOTOS - archivos.length;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">Fotos</h2>
        <p className="text-sm text-muted-foreground">
          {archivos.length} de {MAXIMO_FOTOS}
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {lugares > 0 && (
          <ElegirFotos
            disabled={disabled}
            onArchivos={(nuevos) =>
              onCambiar([...archivos, ...nuevos].slice(0, MAXIMO_FOTOS))
            }
          />
        )}
        {vistas.map((url, i) => (
          <li
            key={url}
            className="relative aspect-square overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
            <img
              src={url}
              alt={`Foto ${i + 1}`}
              className="size-full object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background uppercase">
                Principal
              </span>
            )}
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              disabled={disabled}
              onClick={() => onCambiar(archivos.filter((_, j) => j !== i))}
              aria-label={`Quitar la foto ${i + 1}`}
              className="absolute top-1 right-1"
            >
              <X />
            </Button>
          </li>
        ))}
      </ul>
      {archivos.length > MAXIMO_FOTOS - 1 && (
        <p className="text-sm text-muted-foreground">
          Llegaste al máximo de {MAXIMO_FOTOS} fotos.
        </p>
      )}
    </section>
  );
}
