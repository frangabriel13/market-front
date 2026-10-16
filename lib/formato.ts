const PESOS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// 12500 → "$ 12.500"
export function formatearPrecio(pesos: number): string {
  return PESOS.format(pesos);
}
