import type { NextRequest } from "next/server";
import { apiUrl } from "@/lib/api/server";
import { REFRESH_COOKIE } from "@/lib/schemas/auth";
import { ACCESS_COOKIE } from "@/lib/sesion";

const REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "user-agent",
];

// fetch ya descomprime el cuerpo; set-cookie se copia aparte porque puede repetirse.
const RESPONSE_HEADERS_EXCLUIDOS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "set-cookie",
  "transfer-encoding",
]);

async function reenviar(
  request: NextRequest,
  ctx: RouteContext<"/api/[...path]">,
): Promise<Response> {
  const { path } = await ctx.params;
  const url = apiUrl(path.map(encodeURIComponent).join("/"));
  url.search = request.nextUrl.search;

  const headers = new Headers();
  for (const nombre of REQUEST_HEADERS) {
    const valor = request.headers.get(nombre);
    if (valor) headers.set(nombre, valor);
  }
  // Sesión del panel (ver lib/sesion.ts). proxy.ts ya la renovó si hacía falta.
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) headers.set("cookie", `${REFRESH_COOKIE}=${refreshToken}`);
  // La API resuelve la marca de la tienda por el host.
  const host = request.headers.get("host");
  if (host) headers.set("x-forwarded-host", host);
  // La API tiene que confiar en este header para limitar pedidos por IP.
  const ip = request.headers.get("x-forwarded-for");
  if (ip) headers.set("x-forwarded-for", ip);

  const tieneBody = request.method !== "GET" && request.method !== "HEAD";

  let res: Response;
  try {
    res = await fetch(url, {
      method: request.method,
      headers,
      body: tieneBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return Response.json(
      {
        statusCode: 502,
        message: "No pudimos conectarnos con el servidor. Probá de nuevo.",
      },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  res.headers.forEach((valor, nombre) => {
    if (!RESPONSE_HEADERS_EXCLUIDOS.has(nombre)) {
      responseHeaders.set(nombre, valor);
    }
  });
  for (const cookie of res.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export {
  reenviar as GET,
  reenviar as POST,
  reenviar as PUT,
  reenviar as PATCH,
  reenviar as DELETE,
};
