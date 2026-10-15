import "server-only";
import { toApiError } from "./error";

export { ApiError } from "./error";

export function apiUrl(path: string): URL {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error("Falta la variable de entorno API_URL");
  }
  return new URL(path, base);
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  // Access token del usuario, para los endpoints de /panel y /admin.
  token?: string;
};

// Pide datos a la API desde el servidor de Next (Server Components, Server
// Actions, Route Handlers). El navegador nunca llama directo a la API: usa el
// proxy /api (app/api/[...path]/route.ts).
export async function apiFetch<T>(
  path: string,
  { body, token, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("content-type", "application/json");
  }
  if (token) {
    requestHeaders.set("authorization", `Bearer ${token}`);
  }

  const res = await fetch(apiUrl(path), {
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    throw await toApiError(res);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
