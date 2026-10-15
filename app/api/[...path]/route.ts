import type { NextRequest } from "next/server";
import { apiUrl } from "@/lib/api/server";

// Proxy /api/* → API. Las acciones del navegador pasan por acá, así la API
// no necesita CORS para dominios propios y la cookie de refresh queda en el
// dominio de la tienda.

// Headers del navegador que se reenvían a la API. El resto se descarta.
const REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "cookie",
  "user-agent",
];

// Headers de la respuesta que no se copian: los maneja cada conexión, y fetch
// ya descomprime el cuerpo. set-cookie se copia aparte (puede venir varias veces).
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
  // La API resuelve la marca de la tienda por el host.
  const host = request.headers.get("host");
  if (host) headers.set("x-forwarded-host", host);
  // IP real del comprador, para el límite de pedidos por IP. En Vercel la
  // completa la plataforma; la API tiene que confiar en este header.
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
