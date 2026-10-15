"use server";

import { ApiError, apiFetch } from "@/lib/api/server";
import { restablecerSchema, type RestablecerInput } from "@/lib/schemas/auth";

type ErrorRestablecer = { error: string; linkInvalido?: boolean };

export async function restablecerPassword(
  datos: RestablecerInput,
): Promise<ErrorRestablecer | undefined> {
  const restablecer = restablecerSchema.safeParse(datos);
  if (!restablecer.success) return { error: "Revisá la contraseña." };

  try {
    await apiFetch("auth/restablecer", {
      method: "POST",
      body: restablecer.data,
    });
  } catch (error) {
    // Sin `errors` (de validación), el 400 es por el token: venció o ya se usó.
    if (error instanceof ApiError && error.status === 400 && !error.errors) {
      return { error: "El link no es válido o venció.", linkInvalido: true };
    }
    if (error instanceof ApiError && error.status < 500) {
      return { error: error.message };
    }
    return { error: "No pudimos cambiar la contraseña. Probá de nuevo." };
  }
}
