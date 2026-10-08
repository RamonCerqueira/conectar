export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && !("response" in error))
    return error.message || fallback;
  const failure = error as {
    response?: { status?: number; data?: { message?: string | string[] } };
  };
  const message = failure?.response?.data?.message;
  if (Array.isArray(message)) return message.join(" • ");
  if (typeof message === "string") return message;
  return fallback;
}
