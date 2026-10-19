import { NextResponse, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api/server";
import { tiendaFetch } from "@/lib/api/tienda";
import { REFRESH_COOKIE } from "@/lib/schemas/auth";
import { identificarTienda } from "@/lib/schemas/tienda";
import {
  ACCESS_COOKIE,
  autenticar,
  cookiesDeSesion,
  destinoPorRol,
  leerAccessToken,
  type AccessPayload,
  type CookieDeSesion,
} from "@/lib/sesion";

// Las tiendas (<slug>.<PLATFORM_DOMAIN> o un dominio propio) se sirven desde
// app/tienda/[host]; los paneles, solo desde PLATFORM_DOMAIN.
const RUTAS_DE_TIENDA = "/tienda";
const RUTAS_CON_SESION = ["/panel", "/admin", "/login", "/api"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // En desarrollo, nextUrl trae localhost aunque se pida un subdominio.
  const host = hostSinPuerto(request.headers.get("host") ?? "");
  const tienda = identificarTienda(host, process.env.PLATFORM_DOMAIN ?? "");

  if (tienda && !pathname.startsWith("/api/")) return abrirTienda(request, host);
  if (!tienda && esDeLaSeccion(pathname, RUTAS_DE_TIENDA)) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
  if (!RUTAS_CON_SESION.some((ruta) => esDeLaSeccion(pathname, ruta))) {
    return NextResponse.next();
  }
  return controlarSesion(request);
}

const hostSinPuerto = (host: string) =>
  host.trim().toLowerCase().replace(/:\d+$/, "");

const esDeLaSeccion = (pathname: string, seccion: string) =>
  pathname === seccion || pathname.startsWith(`${seccion}/`);

async function abrirTienda(
  request: NextRequest,
  host: string,
): Promise<NextResponse> {
  const url = request.nextUrl.clone();
  if (!(await tiendaDisponible(host))) {
    url.pathname = `${RUTAS_DE_TIENDA}/no-disponible`;
    return NextResponse.rewrite(url, { status: 404 });
  }
  const { pathname } = request.nextUrl;
  url.pathname = `${RUTAS_DE_TIENDA}/${host}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

// Solo el 404 de la API significa "no disponible": si la API falla, la página
// muestra el error y se puede reintentar.
async function tiendaDisponible(host: string): Promise<boolean> {
  try {
    await tiendaFetch(host, "tienda");
    return true;
  } catch (error) {
    return !(error instanceof ApiError && error.status === 404);
  }
}

// Antes de /panel, /admin, /login y el proxy /api:
//   - Si el access token venció y hay refresh token, lo renueva.
//   - /panel y /admin: sin sesión van a /login; con el rol equivocado, a su sección.
//   - /login con sesión va directo a su sección.
// Son chequeos para la experiencia de uso: la API verifica el token en cada pedido.
async function controlarSesion(request: NextRequest): Promise<NextResponse> {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
