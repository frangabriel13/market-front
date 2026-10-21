// 3 → "N.º 0003"
export const numeroDePedido = (numero: number) =>
  `N.º ${String(numero).padStart(4, "0")}`;
