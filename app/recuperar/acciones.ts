"use server";

import { ApiError, apiFetch } from "@/lib/api/server";
import { recuperarSchema, type RecuperarInput } from "@/lib/schemas/auth";

export async function pedirLink(
  datos: RecuperarInput,
): Promise<{ error: string } | undefined> {
  const recuperar = recuperarSchema.safeParse(datos);
  if (!recuperar.success) return { error: "Revisá el email." };

  try {
    await apiFetch("auth/recuperar", { method: "POST", body: recuperar.data });
  } catch (error) {
    return {
      error:
        error instanceof ApiError && error.status < 500
          ? error.message
          : "No pudimos enviar el link. Probá de nuevo.",
    };
  }
}
