/**
 * Capturas Inspección 5: login, health, módulos autenticados y reporte HTML.
 * Credenciales: PLAYWRIGHT_EMAIL / PLAYWRIGHT_PASSWORD (defaults E2E).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const evidencias = path.join(root, "evidencias");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5174";
const apiURL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3000";
const email = process.env.PLAYWRIGHT_EMAIL ?? "admin@wanka.local";
const password = process.env.PLAYWRIGHT_PASSWORD ?? "WankaAdmin2026";

fs.mkdirSync(evidencias, { recursive: true });

async function openMenu(page, name) {
  await page.getByRole("button", { name }).click();
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(baseURL, { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(evidencias, "playwright-pantalla-login.png"),
  fullPage: true,
});

const health = await page.request.get(`${apiURL}/health`);
const healthJson = await health.json();
const healthHtml = `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Health API</title>
<style>body{font-family:Segoe UI,Arial,sans-serif;padding:32px;background:#0b1220;color:#e8eefc}pre{background:#111827;padding:16px;border-radius:8px}</style>
</head><body><h1>GET /health — ${health.status()}</h1><pre>${JSON.stringify(healthJson, null, 2)}</pre>
<p>Capturado para Inspección 5 · disponibilidad Playwright</p></body></html>`;
fs.writeFileSync(path.join(evidencias, "playwright-health.html"), healthHtml, "utf8");
await page.setContent(healthHtml);
await page.screenshot({
  path: path.join(evidencias, "playwright-health.png"),
  fullPage: true,
});

await page.goto(baseURL, { waitUntil: "networkidle" });
await page.getByLabel("Correo electrónico").fill(email);
await page.getByLabel("Contraseña").fill(password);
await page.getByRole("button", { name: "Ingresar" }).click();
await page.getByRole("heading", { name: "Operación logística" }).waitFor({
  timeout: 20_000,
});
await page.screenshot({
  path: path.join(evidencias, "playwright-inicio.png"),
  fullPage: true,
});

await openMenu(page, "Pedidos");
await page.getByRole("heading", { name: /Pedidos/i }).waitFor();
await page.screenshot({
  path: path.join(evidencias, "playwright-pedidos.png"),
  fullPage: true,
});

await openMenu(page, "Indicadores");
await page.getByRole("heading", { name: /Indicadores|sostenibilidad/i }).waitFor();
await page.screenshot({
  path: path.join(evidencias, "playwright-indicadores.png"),
  fullPage: true,
});

await openMenu(page, "Rutas");
await page.getByRole("heading", { name: "Planificación de rutas" }).waitFor();
await page.screenshot({
  path: path.join(evidencias, "playwright-rutas.png"),
  fullPage: true,
});

const reportIndex = path.join(root, "frontend", "playwright-report", "index.html");
if (fs.existsSync(reportIndex)) {
  await page.goto(`file://${reportIndex.replace(/\\/g, "/")}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(evidencias, "playwright-reporte-html.png"),
    fullPage: true,
  });
}

await browser.close();
console.log("Evidencias escritas en", evidencias);
