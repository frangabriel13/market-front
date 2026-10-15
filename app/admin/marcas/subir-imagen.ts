import { comprimirImagen } from "@/lib/comprimir-imagen";
import { archivoImagenSchema } from "@/lib/schemas/imagenes";
import type { ImagenMarca } from "@/lib/schemas/marcas";
import { pedirUrlDeImagen } from "./acciones";

// Comprime, pide la URL firmada y sube directo al almacenamiento. Devuelve la URL pública.
export async function subirImagen(
  marcaId: string,
  tipo: ImagenMarca["tipo"],
  archivo: File,
): Promise<{ url: string } | { error: string }> {
  let imagen: Blob;
  try {
    imagen = await comprimirImagen(archivo);
  } catch {
    return { error: "No pudimos leer la imagen. Probá con otra." };
  }

  const datos = archivoImagenSchema.safeParse({
    contentType: imagen.type,
    tamanio: imagen.size,
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]?.message ?? "Imagen inválida." };
  }

  const resultado = await pedirUrlDeImagen(marcaId, { tipo, ...datos.data });
  if ("error" in resultado) return resultado;

  const res = await fetch(resultado.subida.uploadUrl, {
    method: "PUT",
    body: imagen,
    headers: { "content-type": imagen.type },
  }).catch(() => null);
  if (!res?.ok) return { error: "No pudimos subir la imagen. Probá de nuevo." };
  return { url: resultado.subida.url };
}
