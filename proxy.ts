import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/schemas/auth";
import {
  ACCESS_COOKIE,
  autenticar,
  cookiesDeSesion,
  destinoPorRol,
  leerAccessToken,
  type AccessPayload,
  type CookieDeSesion,
} from "@/lib/sesion";

// Antes de /panel, /admin, /login y el proxy /api:
//   - Si el access token venció y hay refresh token, lo renueva.
//   - /panel y /admin: sin sesión van a /login; con el rol equivocado, a su sección.
//   - /login con sesión va directo a su sección.
// Son chequeos para la experiencia de uso: la API verifica el token en cada pedido.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // login, refresh y logout los hacen las Server Actions y este archivo.
  if (pathname.startsWith("/api/auth/")) return NextResponse.next();

  const { usuario, renovadas } = await obtenerSesion(request);

  let response: NextResponse;
  if (pathname.startsWith("/api/")) {
    // Las rutas públicas de la tienda también pasan por acá: la API decide.
    response = continuar(request, renovadas);
  } else if (pathname === "/login") {
    response =
      usuario && request.method === "GET"
        ? redirigir(request, destinoPorRol(usuario.rol))
        : continuar(request, renovadas);
  } else {
    const seccion = pathname.startsWith("/admin") ? "/admin" : "/panel";
    if (!usuario) {
      response = redirigir(request, "/login");
    } else if (destinoPorRol(usuario.rol) !== seccion) {
      response = redirigir(request, destinoPorRol(usuario.rol));
    } else {
      response = continuar(request, renovadas);
    }
  }

  for (const cookie of renovadas) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
  return response;
}

async function obtenerSesion(
  request: NextRequest,
): Promise<{ usuario: AccessPayload | null; renovadas: CookieDeSesion[] }> {
  const usuario = leerAccessToken(request.cookies.get(ACCESS_COOKIE)?.value);
  if (usuario) return { usuario, renovadas: [] };

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return { usuario: null, renovadas: [] };

  try {
    const resultado = await autenticar({ refreshToken });
    return {
      usuario: leerAccessToken(resultado.sesion.accessToken),
      renovadas: cookiesDeSesion(resultado),
    };
  } catch {
    // No se borran las cookies: si otro pedido renovó la sesión al mismo
    // tiempo (la API rota el refresh token), borrarlas pisaría la nueva.
    return { usuario: null, renovadas: [] };
  }
}

// Sigue al destino. Si se renovó la sesión, la página o el Route Handler ven
// las cookies nuevas en el mismo pedido.
function continuar(request: NextRequest, renovadas: CookieDeSesion[]): NextResponse {
  if (renovadas.length === 0) return NextResponse.next();
  for (const cookie of renovadas) {
    request.cookies.set(cookie.name, cookie.value);
  }
  return NextResponse.next({ request: { headers: request.headers } });
}

function redirigir(request: NextRequest, destino: string): NextResponse {
  return NextResponse.redirect(new URL(destino, request.url));
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/login", "/api/:path*"],
};
