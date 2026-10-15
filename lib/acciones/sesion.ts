"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REFRESH_COOKIE } from "@/lib/schemas/auth";
import { ACCESS_COOKIE, cerrarSesionEnApi } from "@/lib/sesion";

export async function cerrarSesion(): Promise<void> {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    try {
      await cerrarSesionEnApi(refreshToken);
    } catch {
      // Si la API no responde, igual se cierra la sesión en este navegador.
    }
  }
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  redirect("/login");
}
