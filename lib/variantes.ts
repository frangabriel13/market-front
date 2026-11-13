import { SIN_VALOR } from "@/lib/schemas/productos";

// "Negro / M", "Negro", "M" o "", según lo que tenga el producto.
export const descripcionVariante = ({
  color,
  talle,
}: {
  color: string;
  talle: string;
}) => [color, talle].filter((valor) => valor !== SIN_VALOR).join(" / ");

// A 375 px, la grilla color × talle entra hasta 5 talles. Con más, en el
// celular va un bloque por color con los talles en filas de 5, sin scroll de
// costado.
export const MAXIMO_TALLES_EN_GRILLA = 5;
