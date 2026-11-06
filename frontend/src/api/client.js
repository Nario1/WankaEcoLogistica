const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function formatApiError(error) {
  if (!(error instanceof ApiError) || !error.details) return error.message;
  const details = Object.entries(error.details)
    .map(([field, message]) => `${field}: ${message}`)
    .join(". ");
  return details ? `${error.message}. ${details}` : error.message;
}

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");
  if (options.body) headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      payload.error?.message ?? "La operación no pudo completarse",
      {
        status: response.status,
        code: payload.error?.code,
        details: payload.error?.details,
      },
    );
  }
  return payload.data;
}

export async function apiDownload(path, { token, filename } = {}) {
  const headers = new Headers({ accept: "*/*" });
  if (token) headers.set("authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { headers });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new ApiError(
      payload.error?.message ?? "La descarga no pudo completarse",
      {
        status: response.status,
        code: payload.error?.code,
        details: payload.error?.details,
      },
    );
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") ?? "";
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  const resolvedName = filename ?? match?.[1] ?? "reporte";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = resolvedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
