import { notFound } from "next/navigation";

// Siempre es un 404: no hay navegación instantánea que validar.
export const instant = false;

// Las rutas que no existen muestran el 404 dentro del layout de la tienda.
export default function RutaInexistente() {
  notFound();
}
