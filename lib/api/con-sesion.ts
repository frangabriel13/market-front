import "server-only";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/sesion";
import { apiFetch, type ApiFetchOptions } from "./server";

export async function apiFetchConSesion<T>(
  path: string,
  options: Omit<ApiFetchOptions, "token"> = {},
): Promise<T> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  return apiFetch<T>(path, { ...options, token });
}
