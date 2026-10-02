import crypto from "node:crypto";
import { DomainError } from "./errors.js";

const users = [
  { id: "usr-admin", email: "admin@wanka.pe", password: "Wanka2026!", role: "ADMINISTRADOR", name: "Administradora Wanka" },
  { id: "usr-operador", email: "operador@wanka.pe", password: "Wanka2026!", role: "OPERADOR", name: "Operador Wanka" },
  { id: "usr-planificador", email: "planificador@wanka.pe", password: "Wanka2026!", role: "PLANIFICADOR", name: "Planificador Wanka" }
];
const sessions = new Map();

export function login({ email, password }) {
  const user = users.find((item) => item.email === String(email).toLowerCase() && item.password === password);
  if (!user) throw new DomainError("Credenciales inválidas.", 401, "INVALID_CREDENTIALS");
  const token = crypto.randomUUID();
  sessions.set(token, { id: user.id, email: user.email, role: user.role, name: user.name });
  return { token, user: sessions.get(token) };
}

export function requireRole(authorization, allowedRoles) {
  const token = authorization?.replace("Bearer ", "");
  const user = sessions.get(token);
  if (!user) throw new DomainError("Debe iniciar sesión.", 401, "UNAUTHENTICATED");
  if (!allowedRoles.includes(user.role)) throw new DomainError("No tiene permisos para esta acción.", 403, "FORBIDDEN");
  return user;
}

export function resetAuthForTests() { sessions.clear(); }
