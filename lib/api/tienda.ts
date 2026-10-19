import "server-only";
import { HEADER_HOST_TIENDA } from "@/lib/schemas/tienda";
import { apiFetch, type ApiFetchOptions } from "./server";

export function tiendaFetch<T>(
  host: string,
  path: string,
  { headers, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set(HEADER_HOST_TIENDA, host);
  return apiFetch<T>(path, { ...options, headers: requestHeaders });
}
