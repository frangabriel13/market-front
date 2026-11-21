import { notFound } from "next/navigation";

// Se arma en el build: el 404 que pone el proxy al reescribir se pierde, así
// que la página misma es un 404 y el texto va en not-found.tsx.
export default function TiendaNoDisponiblePage() {
  notFound();
}
