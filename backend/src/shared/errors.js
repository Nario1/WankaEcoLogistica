export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message, details) =>
  new AppError(400, "VALIDATION_ERROR", message, details);

export const unauthorized = (message = "Credenciales inválidas") =>
  new AppError(401, "UNAUTHORIZED", message);

export const forbidden = () =>
  new AppError(403, "FORBIDDEN", "No cuenta con permisos para esta operación");

export const notFound = (resource) =>
  new AppError(404, "NOT_FOUND", `${resource} no encontrado`);

export const conflict = (message) => new AppError(409, "CONFLICT", message);
