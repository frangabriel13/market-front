import { ApiError } from "@/lib/api/error";

export type ErrorAccion = { error: string; campos?: Record<string, string> };

export const DATOS_INVALIDOS: ErrorAccion = {
  error: "Revisá los datos marcados.",
};

type Conflicto = { campo: string; mensaje?: string };

// Un 409 (ej. slug o email repetido) se muestra en `conflicto.campo`, con
// `conflicto.mensaje` si el de la API usa palabras que no están en pantalla.
export function errorDeApi(
  error: unknown,
  conflicto?: Conflicto,
): ErrorAccion {
  if (!(error instanceof ApiError) || error.status >= 500) {
    return { error: "No pudimos guardar los cambios. Probá de nuevo." };
  }
  if (error.status === 409 && conflicto) {
    const mensaje = conflicto.mensaje ?? error.message;
    return { error: mensaje, campos: { [conflicto.campo]: mensaje } };
  }
  return { error: error.message, campos: camposConError(error.errors) };
}

function camposConError(errors: unknown): Record<string, string> | undefined {
  if (!Array.isArray(errors)) return undefined;
  return Object.fromEntries(
    errors
      .filter((issue) => Array.isArray(issue?.path))
      .map((issue) => [issue.path.join("."), String(issue.message)]),
  );
}
