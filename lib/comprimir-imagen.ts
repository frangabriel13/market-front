// Achica y recomprime en el navegador. Devuelve el original si no mejora.
export async function comprimirImagen(
  archivo: File,
  ladoMaximo = 2000,
): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let comprimida = await aBlob(canvas, "image/webp");
  // Safari no codifica WebP: PNG conserva la transparencia de los logos.
  if (comprimida?.type !== "image/webp") {
    comprimida = await aBlob(
      canvas,
      archivo.type === "image/png" ? "image/png" : "image/jpeg",
    );
  }
  return comprimida && comprimida.size < archivo.size ? comprimida : archivo;
}

function aBlob(canvas: HTMLCanvasElement, tipo: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, tipo, 0.85));
}
