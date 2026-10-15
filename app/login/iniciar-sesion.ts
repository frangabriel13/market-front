import { ApiError } from "@/lib/api/error";
import type { Login, Sesion } from "@/lib/schemas/auth";

// TODO(1.14): simulado. Reemplazar por POST /api/auth/login y redirigir a
// /panel o /admin según el rol. Por ahora siempre responde como la API ante
// credenciales incorrectas, para ver los estados de carga y de error.
export async function iniciarSesion(datos: Login): Promise<Sesion> {
  void datos;
  await new Promise((resolve) => setTimeout(resolve, 800));
  throw new ApiError(401, "Email o contraseña incorrectos");
}
