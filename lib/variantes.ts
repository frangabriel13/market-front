import { SIN_VALOR } from "@/lib/schemas/productos";

// "Negro / M", "Negro", "M" o "", según lo que tenga el producto.
export const descripcionVariante = ({
  color,
  talle,
}: {
  color: string;
  talle: string;
}) => [color, talle].filter((valor) => valor !== SIN_VALOR).join(" / ");
