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

const ZONA = "America/Argentina/Buenos_Aires";
const DIA = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA });
const HORA = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: ZONA,
});
const DIA_SEMANA = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  timeZone: ZONA,
});
const DIAS_MS = 86_400_000;

// "Hoy, 10:42", "Ayer, 17:05", "Lunes, 09:18" (última semana) o "20/10/26, 15:04".
export function formatearCuando(iso: string, ahora = new Date()): string {
  const fecha = new Date(iso);
  const dias = Math.round(
    (Date.parse(DIA.format(ahora)) - Date.parse(DIA.format(fecha))) / DIAS_MS,
  );
  if (dias > 6 || dias < 0) return formatearFechaHora(iso);
  const hora = HORA.format(fecha);
  if (dias === 0) return `Hoy, ${hora}`;
  if (dias === 1) return `Ayer, ${hora}`;
  const dia = DIA_SEMANA.format(fecha);
  return `${dia[0].toUpperCase()}${dia.slice(1)}, ${hora}`;
}
