import jwt from "jsonwebtoken";
import { forbidden, unauthorized } from "../../shared/errors.js";

export function createAuthenticate({ jwtSecret }) {
  return (request, _response, next) => {
    const authorization = request.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return next(unauthorized("Se requiere autenticación"));
    }

    try {
      const payload = jwt.verify(authorization.slice(7), jwtSecret, {
        issuer: "wanka-ecologistica-api",
        audience: "wanka-ecologistica-web",
      });
      request.user = { id: payload.sub, role: payload.role };
      return next();
    } catch {
      return next(unauthorized("Token inválido o vencido"));
    }
  };
}

export const authorize =
  (...roles) =>
  (request, _response, next) =>
    roles.includes(request.user?.role) ? next() : next(forbidden());
