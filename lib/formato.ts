const PESOS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// 12500 → "$ 12.500"
export function formatearPrecio(pesos: number): string {
  return PESOS.format(pesos);
}

// Siempre en hora argentina: el servidor puede correr en UTC.
const FECHA = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});

// "2026-10-20T15:00:00.000Z" → "20 de octubre de 2026"
export function formatearFecha(iso: string): string {
  return FECHA.format(new Date(iso));
}

const FECHA_HORA = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Argentina/Buenos_Aires",
});

// "2026-10-20T18:04:00.000Z" → "20/10/26, 15:04"
export function formatearFechaHora(iso: string): string {
  return FECHA_HORA.format(new Date(iso));
}
