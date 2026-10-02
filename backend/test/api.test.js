import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app.js";
import { validateOrder } from "../src/modules/orders/order.validation.js";
import { validateVehicle } from "../src/modules/vehicles/vehicle.validation.js";

const secret = "a-secure-test-secret-with-more-than-32-chars";
const config = { jwtSecret: secret, corsOrigin: "http://localhost:5173" };
const tokenFor = (role) =>
  jwt.sign({ sub: `${role}-1`, role }, secret, {
    expiresIn: "15m",
    issuer: "wanka-ecologistica-api",
    audience: "wanka-ecologistica-web",
  });

const services = {
  authService: {
    login: async () => ({ token: "token", user: { role: "ADMIN" } }),
  },
  orderService: {
    list: async () => [],
    create: async (body) => ({ id: "order-1", ...validateOrder(body) }),
    update: async () => ({}),
  },
  vehicleService: {
    list: async () => [],
    create: async (body) => ({ id: "vehicle-1", ...validateVehicle(body) }),
    update: async () => ({}),
  },
  driverService: { list: async () => [], create: async () => ({}) },
  routeService: {
    list: async () => [],
    create: async () => ({}),
    assignDriver: async () => ({}),
  },
};

async function withServer(run) {
  const server = createApp({ config, services }).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("health no requiere autenticación y rutas privadas sí", async () => {
  await withServer(async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/health`)).status, 200);
    const privateResponse = await fetch(`${baseUrl}/api/orders`);
    assert.equal(privateResponse.status, 401);
  });
});

test("POST /api/orders identifica el campo inválido con respuesta 400", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${tokenFor("OPERATOR")}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        address: "Av. Ferrocarril 123, Huancayo",
        latitude: -12.0651,
        longitude: -75.2049,
        weightKg: -1,
        windowStart: "08:00",
        windowEnd: "10:00",
      }),
    });
    const body = await response.json();
    assert.equal(response.status, 400);
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.match(body.error.details.weightKg, /número/);
  });
});

test("RBAC permite pedidos al operador y restringe vehículos al administrador", async () => {
  await withServer(async (baseUrl) => {
    const operatorHeaders = {
      authorization: `Bearer ${tokenFor("OPERATOR")}`,
      "content-type": "application/json",
    };
    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: operatorHeaders,
      body: JSON.stringify({
        address: "Av. Ferrocarril 123, Huancayo",
        latitude: -12.0651,
        longitude: -75.2049,
        weightKg: 25,
        priority: "HIGH",
        windowStart: "08:00",
        windowEnd: "10:00",
      }),
    });
    assert.equal(orderResponse.status, 201);
    const vehicleResponse = await fetch(`${baseUrl}/api/vehicles`, {
      method: "POST",
      headers: operatorHeaders,
      body: JSON.stringify({}),
    });
    assert.equal(vehicleResponse.status, 403);
    const adminResponse = await fetch(`${baseUrl}/api/vehicles`, {
      method: "POST",
      headers: {
        ...operatorHeaders,
        authorization: `Bearer ${tokenFor("ADMIN")}`,
      },
      body: JSON.stringify({
        plate: "W3X-123",
        capacityKg: 1_000,
        consumptionPerKm: 0.12,
        emissionFactor: 2.68,
      }),
    });
    assert.equal(adminResponse.status, 201);
  });
});

test("un token inválido se rechaza sin filtrar detalles internos", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/orders`, {
      headers: { authorization: "Bearer invalid-token" },
    });
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error.code, "UNAUTHORIZED");
    assert.equal(body.error.stack, undefined);
  });
});
