import "server-only";
import { z } from "zod";
import { apiUrl } from "@/lib/api/server";
import { toApiError } from "@/lib/api/error";
import { REFRESH_COOKIE, sesionSchema, type Login, type Sesion } from "@/lib/schemas/auth";
import { rolSchema, type Rol } from "@/lib/schemas/roles";

// Sesión del panel. Viven dos cookies httpOnly en el dominio del front:
//   - access_token: el JWT de la API (15 min). El servidor de Next lo agrega
//     como Bearer al llamar a la API; el JavaScript del navegador nunca lo ve.
//   - refresh_token: la que emite la API (30 días). Se usa para renovar el
//     access token en proxy.ts.
// Todo lo que se decide acá con el token (redirigir según el rol) es para la
// experiencia de uso: la firma la verifica la API en cada pedido.

export const ACCESS_COOKIE = "access_token";

// Antes del vencimiento real, para no mandarle a la API un token a punto de vencer.
const MARGEN_VENCIMIENTO_MS = 30_000;

const opcionesBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export interface CookieDeSesion {
  name: string;
  value: string;
  options: typeof opcionesBase & { expires: Date };
}

export interface ResultadoAuth {
  sesion: Sesion;
  refreshToken: string;
  refreshExpiraEn: Date;
}

const accessPayloadSchema = z.object({
  sub: z.string(),
  rol: rolSchema,
  marcaId: z.string().nullable(),
  exp: z.number(),
});

export type AccessPayload = z.infer<typeof accessPayloadSchema>;

// Lee el access token sin verificar la firma. Devuelve null si falta, si no
// se puede leer o si está por vencer.
export function leerAccessToken(token: string | undefined): AccessPayload | null {
  const parte = token?.split(".")[1];
  if (!parte) return null;
  let json: unknown;
  try {
    json = JSON.parse(Buffer.from(parte, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  const payload = accessPayloadSchema.safeParse(json);
  if (!payload.success) return null;
  if (payload.data.exp * 1000 - MARGEN_VENCIMIENTO_MS <= Date.now()) return null;
  return payload.data;
}

export function destinoPorRol(rol: Rol): "/admin" | "/panel" {
  return rol === "ADMIN" ? "/admin" : "/panel";
}

// Llama a POST /auth/login o /auth/refresh y separa los dos tokens: el access
// viene en el body y el refresh en el Set-Cookie de la API.
export async function autenticar(
  opciones: { login: Login } | { refreshToken: string },
): Promise<ResultadoAuth> {
  const esLogin = "login" in opciones;
  const res = await fetch(apiUrl(esLogin ? "auth/login" : "auth/refresh"), {
    method: "POST",
    headers: esLogin
      ? { "content-type": "application/json", accept: "application/json" }
      : { cookie: `${REFRESH_COOKIE}=${opciones.refreshToken}`, accept: "application/json" },
    body: esLogin ? JSON.stringify(opciones.login) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw await toApiError(res);

  const sesion = sesionSchema.parse(await res.json());
  const refresh = leerRefreshCookie(res.headers.getSetCookie());
  if (!refresh) throw new Error("La API no devolvió la cookie de refresh");
  return { sesion, refreshToken: refresh.valor, refreshExpiraEn: refresh.expira };
}

export async function cerrarSesionEnApi(refreshToken: string): Promise<void> {
  await fetch(apiUrl("auth/logout"), {
    method: "POST",
    headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}

// Las cookies a guardar en el navegador. Sirven tanto para cookies() en una
// Server Action como para response.cookies en proxy.ts.
export function cookiesDeSesion(resultado: ResultadoAuth): CookieDeSesion[] {
  const access = leerAccessToken(resultado.sesion.accessToken);
  const accessExpira = access ? new Date(access.exp * 1000) : new Date();
  return [
    {
      name: ACCESS_COOKIE,
      value: resultado.sesion.accessToken,
      options: { ...opcionesBase, expires: accessExpira },
    },
    {
      name: REFRESH_COOKIE,
      value: resultado.refreshToken,
      options: { ...opcionesBase, expires: resultado.refreshExpiraEn },
    },
  ];
}

function leerRefreshCookie(setCookies: string[]): { valor: string; expira: Date } | null {
  const cookie = setCookies.find((c) => c.startsWith(`${REFRESH_COOKIE}=`));
  if (!cookie) return null;
  const [par, ...atributos] = cookie.split(";");
  const valor = par.slice(REFRESH_COOKIE.length + 1);
  const expires = atributos
    .map((a) => a.trim())
    .find((a) => a.toLowerCase().startsWith("expires="));
  const expira = expires ? new Date(expires.slice("expires=".length)) : null;
  if (!valor || !expira || Number.isNaN(expira.getTime())) return null;
  return { valor, expira };
}
