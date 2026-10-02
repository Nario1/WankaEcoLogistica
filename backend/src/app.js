import { createServer } from "node:http";
import { login, requireRole } from "./modules/auth.js";
import { createOrder, listOrders } from "./modules/orders.js";
import { createVehicle, listVehicles } from "./modules/vehicles.js";
import { createDriver, listDrivers, assignDriver } from "./modules/drivers.js";
import { DomainError } from "./modules/errors.js";

const roles = { orders: ["ADMINISTRADOR", "OPERADOR"], vehicles: ["ADMINISTRADOR"], drivers: ["ADMINISTRADOR", "PLANIFICADOR"] };
const readBody = (request) => new Promise((resolve, reject) => { let raw = ""; request.on("data", (part) => raw += part); request.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new DomainError("JSON inválido.")); } }); });
const send = (response, status, body) => { response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" }); response.end(JSON.stringify(body)); };

export function createApp() {
  return createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") return send(response, 200, { status: "ok" });
      const body = request.method === "POST" ? await readBody(request) : null;
      if (request.method === "POST" && request.url === "/api/auth/login") return send(response, 200, login(body));
      if (request.method === "GET" && request.url === "/api/orders") { requireRole(request.headers.authorization, roles.orders); return send(response, 200, listOrders()); }
      if (request.method === "POST" && request.url === "/api/orders") { requireRole(request.headers.authorization, roles.orders); return send(response, 201, createOrder(body)); }
      if (request.method === "GET" && request.url === "/api/vehicles") { requireRole(request.headers.authorization, roles.vehicles); return send(response, 200, listVehicles()); }
      if (request.method === "POST" && request.url === "/api/vehicles") { requireRole(request.headers.authorization, roles.vehicles); return send(response, 201, createVehicle(body)); }
      if (request.method === "GET" && request.url === "/api/drivers") { requireRole(request.headers.authorization, roles.drivers); return send(response, 200, listDrivers()); }
      if (request.method === "POST" && request.url === "/api/drivers") { requireRole(request.headers.authorization, roles.drivers); return send(response, 201, createDriver(body)); }
      const assignment = request.url?.match(/^\/api\/drivers\/([^/]+)\/assignment$/);
      if (request.method === "POST" && assignment) { requireRole(request.headers.authorization, roles.drivers); return send(response, 200, assignDriver(assignment[1], body.routeId, body.hours)); }
      return send(response, 404, { message: "Recurso no encontrado." });
    } catch (error) { return send(response, error instanceof DomainError ? error.status : 500, { message: error.message || "Error interno.", code: error.code || "INTERNAL_ERROR" }); }
  });
}
