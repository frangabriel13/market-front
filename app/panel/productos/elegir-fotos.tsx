"use client";

import { Camera, Image as ImagenIcono, Loader2 } from "lucide-react";
import { useRef } from "react";
import { FORMATOS_IMAGEN } from "@/lib/schemas/imagenes";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  // Mientras sube: "Subiendo 1 de 3…" en lugar de los botones.
  progreso?: string;
  onArchivos: (archivos: File[]) => void;
};

const RECUADRO =
  "flex size-full flex-col items-center justify-center gap-2 bg-background p-2 text-center text-sm font-bold disabled:opacity-60";

// Dos recuadros para la grilla de fotos: la cámara (en el celular) y la galería.
export function ElegirFotos({ disabled, progreso, onArchivos }: Props) {
  const camara = useRef<HTMLInputElement>(null);
  const galeria = useRef<HTMLInputElement>(null);

  const alElegir = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = [...(evento.target.files ?? [])];
    evento.target.value = "";
    if (archivos.length > 0) onArchivos(archivos);
  };

  if (progreso) {
    return (
      <li className="col-span-2 aspect-[2/1]">
        <p className={cn(RECUADRO, "border border-dashed text-muted-foreground")}>
          <Loader2 className="size-5 animate-spin" />
          {progreso}
        </p>
      </li>
    );
  }

  return (
    <>
      <li className="aspect-square">
        <button
          type="button"
          disabled={disabled}
          onClick={() => camara.current?.click()}
          className={cn(RECUADRO, "border-2 border-foreground")}
        >
          <Camera className="size-6" />
          Sacar foto
        </button>
        <input
          ref={camara}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          aria-label="Sacar foto"
          onChange={alElegir}
        />
      </li>
      <li className="aspect-square">
        <button
          type="button"
          disabled={disabled}
          onClick={() => galeria.current?.click()}
          className={cn(RECUADRO, "border border-input")}
        >
          <ImagenIcono className="size-6" />
          Elegir de la galería
        </button>
        <input
          ref={galeria}
          type="file"
          multiple
          accept={FORMATOS_IMAGEN.join(",")}
          className="hidden"
          aria-label="Elegir fotos de la galería"
          onChange={alElegir}
        />
      </li>
    </>
  );
}
