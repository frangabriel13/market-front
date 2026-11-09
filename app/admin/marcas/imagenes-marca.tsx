"use client";

import { CampoImagen } from "@/components/form/campo-imagen";
import type { ImagenMarca, Marca } from "@/lib/schemas/marcas";
import { subirImagen } from "@/lib/subir-imagen";
import { editarMarca, pedirUrlDeImagen } from "./acciones";

type CampoImagenMarca = "logoUrl" | "portadaUrl";

const IMAGENES: {
  tipo: ImagenMarca["tipo"];
  campo: CampoImagenMarca;
  titulo: string;
  descripcion: string;
  marco: string;
}[] = [
  {
    tipo: "logo",
    campo: "logoUrl",
    titulo: "Logo",
    descripcion: "Se muestra tal cual sobre el encabezado oscuro. Mejor en PNG con fondo transparente.",
    marco: "aspect-square",
  },
  {
    tipo: "portada",
    campo: "portadaUrl",
    titulo: "Portada",
    descripcion: "Foto horizontal para el inicio de la tienda.",
    marco: "aspect-video",
  },
];

export function ImagenesMarca({ marca }: { marca: Marca }) {
  const guardar = (campo: CampoImagenMarca, url: string | null) =>
    editarMarca(marca.id, { [campo]: url });

  return (
    <section className="mb-8 flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-wider uppercase">Imágenes</h2>
      {IMAGENES.map(({ tipo, campo, ...imagen }) => (
        <CampoImagen
          key={tipo}
          {...imagen}
          url={marca[campo]}
          subir={async (archivo) => {
            const subida = await subirImagen(archivo, (datos) =>
              pedirUrlDeImagen(marca.id, { tipo, ...datos }),
            );
            return "error" in subida ? subida : guardar(campo, subida.url);
          }}
          quitar={() => guardar(campo, null)}
        />
      ))}
    </section>
  );
}
