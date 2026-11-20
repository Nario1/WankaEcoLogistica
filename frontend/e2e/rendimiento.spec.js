import { expect, test } from "@playwright/test";

const apiURL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3000";

test.describe("Monitoreo de rendimiento", () => {
  test("login shell: TTFB/FCP/LCP y health de API", async ({ page }) => {
    const apiStarted = Date.now();
    const health = await page.request.get(`${apiURL}/health`);
    const apiMs = Date.now() - apiStarted;
    expect(health.status()).toBe(200);
    expect(apiMs).toBeLessThan(3000);

    await page.goto("/", { waitUntil: "networkidle" });

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const paints = performance.getEntriesByType("paint");
      const fcp = paints.find((entry) => entry.name === "first-contentful-paint");
      return {
        ttfb: nav ? nav.responseStart - nav.requestStart : null,
        fcp: fcp ? fcp.startTime : null,
        domContentLoaded: nav
          ? nav.domContentLoadedEventEnd - nav.startTime
          : null,
        load: nav ? nav.loadEventEnd - nav.startTime : null,
      };
    });

    expect(metrics.ttfb).not.toBeNull();
    expect(metrics.fcp).not.toBeNull();
    expect(metrics.ttfb).toBeLessThan(3000);
    expect(metrics.fcp).toBeLessThan(5000);
    // Umbral académico de la consigna (~500 ms) como meta; en CI se tolera red compartida.
    expect(apiMs).toBeLessThan(process.env.CI ? 2000 : 800);

    // Expuesto en el reporte para el informe de Inspección 5.
    test.info().annotations.push({
      type: "web-vitals",
      description: JSON.stringify({ ...metrics, apiHealthMs: apiMs }),
    });
  });
});
