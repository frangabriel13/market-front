"use client";

import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FORMATOS_IMAGEN } from "@/lib/schemas/imagenes";
import type { ImagenMarca, Marca } from "@/lib/schemas/marcas";
import { cn } from "@/lib/utils";
import { subirImagen } from "@/lib/subir-imagen";
import { editarMarca, pedirUrlDeImagen } from "./acciones";

type CampoImagen = "logoUrl" | "portadaUrl" | "guiaTallesUrl";

const IMAGENES: {
  tipo: ImagenMarca["tipo"];
  campo: CampoImagen;
  titulo: string;
  descripcion: string;
  marco: string;
}[] = [
  {
    tipo: "logo",
    campo: "logoUrl",
    titulo: "Logo",
    descripcion: "PNG con fondo transparente. En la tienda se ve en blanco sobre el encabezado oscuro.",
    marco: "aspect-square",
  },
  {
    tipo: "portada",
    campo: "portadaUrl",
    titulo: "Portada",
    descripcion: "Foto horizontal para el inicio de la tienda.",
    marco: "aspect-video",
  },
  {
    tipo: "guiaTalles",
    campo: "guiaTallesUrl",
    titulo: "Guía de talles",
    descripcion: "Una imagen con la tabla de medidas.",
    marco: "aspect-[3/4]",
  },
];

export function ImagenesMarca({ marca }: { marca: Marca }) {
  return (
    <section className="mb-8 flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-wider uppercase">Imágenes</h2>
      {IMAGENES.map((imagen) => (
        <ImagenMarcaCampo
          key={imagen.tipo}
          {...imagen}
          marcaId={marca.id}
          url={marca[imagen.campo]}
        />
      ))}
    </section>
  );
}

type CampoProps = (typeof IMAGENES)[number] & {
  marcaId: string;
  url: string | null;
};

function ImagenMarcaCampo({
  tipo,
  campo,
  titulo,
  descripcion,
  marco,
  marcaId,
  url,
}: CampoProps) {
  const input = useRef<HTMLInputElement>(null);
  const [pendiente, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  // Que un error viejo no aparezca al volver a la página.
  useLayoutEffect(() => () => setError(undefined), []);

  function guardar(nuevaUrl: string | null) {
    const datos: Partial<Record<CampoImagen, string | null>> = {};
    datos[campo] = nuevaUrl;
    return editarMarca(marcaId, datos);
  }

  function subir(archivo: File) {
    setError(undefined);
    startTransition(async () => {
      const subida = await subirImagen(archivo, (datos) =>
        pedirUrlDeImagen(marcaId, { tipo, ...datos }),
      );
      if ("error" in subida) return setError(subida.error);
      const guardado = await guardar(subida.url);
      if (guardado) setError(guardado.error);
    });
  }

  function quitar() {
    setError(undefined);
    startTransition(async () => {
      const guardado = await guardar(null);
      if (guardado) setError(guardado.error);
    });
  }

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
            {pendiente ? "Subiendo…" : url ? "Cambiar" : "Subir"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pendiente}
              onClick={quitar}
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
            if (archivo) subir(archivo);
          }}
        />
      </div>
    </div>
  );
}
