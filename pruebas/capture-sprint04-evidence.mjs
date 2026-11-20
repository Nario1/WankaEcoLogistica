/**
 * Captura pantallas de evidencia para Sprint 04 / Inspección 5.
 * Requiere frontend en PLAYWRIGHT_BASE_URL (default http://127.0.0.1:5174).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "evidencias", "sprint-04");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5174";

fs.mkdirSync(outDir, { recursive: true });

const browsers = [
  { name: "chromium", launcher: chromium },
  { name: "firefox", launcher: firefox },
  { name: "webkit", launcher: webkit },
];

const results = [];

for (const { name, launcher } of browsers) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const started = Date.now();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  const ttfbProbe = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((e) => e.name === "first-contentful-paint");
    return {
      ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
      fcp: fcp ? Math.round(fcp.startTime) : null,
    };
  });
  await page.getByRole("heading", { name: "WankaEcoLogística" }).waitFor();
  const file = path.join(outDir, `05-login-${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  results.push({
    browser: name,
    file: path.relative(path.resolve(__dirname, ".."), file),
    elapsedMs: Date.now() - started,
    ...ttfbProbe,
  });
  await browser.close();
}

const summaryPath = path.join(outDir, "metricas-login.json");
fs.writeFileSync(summaryPath, JSON.stringify({ baseURL, capturedAt: new Date().toISOString(), results }, null, 2));
console.log(JSON.stringify({ summaryPath, results }, null, 2));
