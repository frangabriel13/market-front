"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAccion } from "@/hooks/use-accion";
import { FORMATOS_IMAGEN } from "@/lib/schemas/imagenes";
import { cn } from "@/lib/utils";

type Resultado = Promise<{ error: string } | undefined>;

type Props = {
  titulo: string;
  descripcion: string;
  // Proporción de la vista previa (ej. "aspect-square").
  marco: string;
  url: string | null;
  subir: (archivo: File) => Resultado;
  quitar: () => Resultado;
};

// Una imagen que se guarda apenas se elige: vista previa, cambiar y quitar.
export function CampoImagen({
  titulo,
  descripcion,
  marco,
  url,
  subir,
  quitar,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const { pendiente, error, ejecutar } = useAccion();

  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3">
      <div
        className={cn(
          "relative self-start overflow-hidden border bg-muted",
          marco,
        )}
      >
        {url ? (
          <Image
            src={url}
            alt={titulo}
            fill
            unoptimized
            className="object-contain"
          />
        ) : (
          <ImageIcon className="absolute inset-0 m-auto size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div>
          <p className="text-sm font-medium">{titulo}</p>
          <p className="text-sm text-muted-foreground">{descripcion}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pendiente}
            onClick={() => input.current?.click()}
          >
            {pendiente ? <Loader2 className="animate-spin" /> : <Upload />}
            {pendiente ? "Guardando…" : url ? "Cambiar" : "Subir"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pendiente}
              onClick={() => ejecutar(quitar)}
            >
              <Trash2 />
              Quitar
            </Button>
          )}
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <input
          ref={input}
          type="file"
          accept={FORMATOS_IMAGEN.join(",")}
          className="hidden"
          aria-label={`Elegir ${titulo.toLowerCase()}`}
          onChange={(evento) => {
            const archivo = evento.target.files?.[0];
            evento.target.value = "";
            if (archivo) ejecutar(() => subir(archivo));
          }}
        />
      </div>
    </div>
  );
}
