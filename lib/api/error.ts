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
    // NestJS puede mandar `message` como lista.
    const texto = Array.isArray(message) ? message.join(". ") : String(message);
    return new ApiError(res.status, texto, errors);
  }
  return new ApiError(res.status, res.statusText || "Error inesperado");
}
