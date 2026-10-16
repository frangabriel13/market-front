import { comprimirImagen } from "@/lib/comprimir-imagen";
import {
  archivoImagenSchema,
  type ArchivoImagen,
  type UrlDeSubida,
} from "@/lib/schemas/imagenes";

type PedirUrl = (
  archivo: ArchivoImagen,
) => Promise<{ subida: UrlDeSubida } | { error: string }>;

// Comprime, pide la URL firmada con `pedirUrl` y sube directo al
// almacenamiento. Devuelve la URL pública.
export async function subirImagen(
  archivo: File,
  pedirUrl: PedirUrl,
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

  const resultado = await pedirUrl(datos.data);
  if ("error" in resultado) return resultado;

  const res = await fetch(resultado.subida.uploadUrl, {
    method: "PUT",
    body: imagen,
    headers: { "content-type": imagen.type },
  }).catch(() => null);
  if (!res?.ok) return { error: "No pudimos subir la imagen. Probá de nuevo." };
  return { url: resultado.subida.url };
}
