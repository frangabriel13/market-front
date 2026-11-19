import { connection } from "next/server";
import { Suspense } from "react";

// Para páginas fijas de la tienda: el título (del layout) se pide en cada
// visita y, sin esta marca, Next avisa que bloquea los metadatos.
export function PorVisita() {
  return (
    <Suspense>
      <Conexion />
    </Suspense>
  );
}

async function Conexion() {
  await connection();
  return null;
}
