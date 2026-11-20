import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth.js";

const apiBase =
  process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3000";

test.describe("rendimiento y disponibilidad", () => {
  test("GET /health responde 200 en menos de 500 ms", async ({
    request,
  }) => {
    const started = Date.now();
    const response = await request.get(`${apiBase}/health`);
    const elapsed = Date.now() - started;
    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(500);
    // eslint-disable-next-line no-console
    console.log(`health_ms=${elapsed}`);
  });

  test("login admin y métricas de carga de inicio", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(
      page.getByRole("heading", { name: "Operación logística" }),
    ).toBeVisible();

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const paints = performance.getEntriesByType("paint");
      const fcp = paints.find((entry) => entry.name === "first-contentful-paint");
      return {
        ttfb: nav ? nav.responseStart - nav.requestStart : null,
        fcp: fcp ? fcp.startTime : null,
        domContentLoaded: nav
          ? nav.domContentLoadedEventEnd - nav.startTime
          : null,
      };
    });

    // eslint-disable-next-line no-console
    console.log(
      `ttfb_ms=${timing.ttfb} fcp_ms=${timing.fcp} dcl_ms=${timing.domContentLoaded}`,
    );
    expect(timing.ttfb).not.toBeNull();
  });
});
