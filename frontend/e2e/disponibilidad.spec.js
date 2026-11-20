import { expect, test } from "@playwright/test";

const apiURL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3000";

test.describe("Disponibilidad y resiliencia", () => {
  test("health responde 200 con cuerpo ok", async ({ request }) => {
    const response = await request.get(`${apiURL}/health`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data?.status ?? body.status).toBeTruthy();
  });

  test("ruta inexistente de API no derriba el servicio", async ({
    request,
  }) => {
    const missing = await request.get(`${apiURL}/api/no-existe-${Date.now()}`);
    expect([404, 401, 403]).toContain(missing.status());
    const health = await request.get(`${apiURL}/health`);
    expect(health.status()).toBe(200);
  });

  test("login sin cuerpo válido responde error controlado", async ({
    request,
  }) => {
    const response = await request.post(`${apiURL}/api/auth/login`, {
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});
