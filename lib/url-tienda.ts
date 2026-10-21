import "server-only";
import type { MarcaResumen } from "@/lib/schemas/marcas";

// En local las tiendas viven en <slug>.localhost, sin https.
export function urlDeTienda({ slug, dominioPropio }: MarcaResumen): string {
  if (dominioPropio) return `https://${dominioPropio}`;
  const dominio = process.env.PLATFORM_DOMAIN;
  return dominio === "localhost"
    ? `http://${slug}.localhost:${process.env.PORT ?? 3000}`
    : `https://${slug}.${dominio}`;
}
