"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/error";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { autenticar, cookiesDeSesion, destinoPorRol } from "@/lib/sesion";

// Login único para fabricantes y para Piter: guarda la sesión en las cookies
// del front y redirige según el rol. Solo vuelve si hubo un error.
export async function iniciarSesion(datos: LoginInput): Promise<{ error: string }> {
  const login = loginSchema.safeParse(datos);
  if (!login.success) {
    return { error: "Revisá el email y la contraseña." };
  }

  let destino: string;
  try {
    const resultado = await autenticar({ login: login.data });
    const jar = await cookies();
    for (const cookie of cookiesDeSesion(resultado)) {
      jar.set(cookie.name, cookie.value, cookie.options);
    }
    destino = destinoPorRol(resultado.sesion.usuario.rol);
  } catch (error) {
    return {
      error:
        error instanceof ApiError && error.status < 500
          ? error.message
          : "No pudimos iniciar sesión. Probá de nuevo.",
    };
  }
  // Fuera del try: redirect() funciona lanzando un error.
  redirect(destino);
}
