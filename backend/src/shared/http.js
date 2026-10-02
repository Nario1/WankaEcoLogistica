import { AppError } from "./errors.js";

export function notFoundHandler(_request, response) {
  response
    .status(404)
    .json({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } });
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof AppError) {
    return response.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    });
  }

  if (error?.code === "23505") {
    return response
      .status(409)
      .json({ error: { code: "CONFLICT", message: "El registro ya existe" } });
  }

  if (error?.code === "23P01") {
    return response.status(409).json({
      error: {
        code: "CONFLICT",
        message: "El recurso presenta un conflicto de horario",
      },
    });
  }

  console.error("Error no controlado", {
    name: error?.name,
    code: error?.code,
  });
  return response.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Ocurrió un error interno" },
  });
}
