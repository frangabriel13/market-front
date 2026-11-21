import { notFound } from "next/navigation";

// Siempre es un 404: no hay navegación instantánea que validar.
export const instant = false;

// Las rutas que no existen muestran el 404 del panel, con el link a productos.
export default function RutaInexistente() {
  notFound();
}
