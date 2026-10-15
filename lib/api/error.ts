// Error de una respuesta no exitosa de la API. NestJS responde
// { statusCode, message, errors? }; `message` puede venir como lista.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function toApiError(res: Response): Promise<ApiError> {
  const body: unknown = await res.json().catch(() => undefined);
  if (body && typeof body === "object" && "message" in body) {
    const { message, errors } = body as { message: unknown; errors?: unknown };
    const texto = Array.isArray(message) ? message.join(". ") : String(message);
    return new ApiError(res.status, texto, errors);
  }
  return new ApiError(res.status, res.statusText || "Error inesperado");
}
