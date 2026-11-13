/**
 * Auditoría Lighthouse de Pedidos (sesión autenticada + paginación).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const outDir = path.join(
  repoRoot,
  "docs",
  "03 Implementación",
  "reduccion del impacto ambiental",
  "evidencias",
);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 0) continue;
    const key = trimmed.slice(0, i).trim();
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv(path.join(repoRoot, "backend", ".env"));
loadEnv(path.join(root, ".env"));

const APP_URL = process.env.LIGHTHOUSE_APP_URL || "http://127.0.0.1:5179";
const API_URL = (
  process.env.LIGHTHOUSE_API_URL ||
  process.env.VITE_API_URL ||
  process.env.API_URL ||
  "http://127.0.0.1:3000/api"
).replace("localhost", "127.0.0.1");
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Faltan ADMIN_EMAIL / ADMIN_PASSWORD");
  process.exit(1);
}

function ensurePackage(name) {
  const candidate = path.join(root, "node_modules", name);
  if (fs.existsSync(candidate)) return candidate;
  console.log(`Instalando ${name}…`);
  const r = spawnSync("npm", ["install", "--no-save", name], {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
  return candidate;
}

ensurePackage("puppeteer");
ensurePackage("lighthouse");
ensurePackage("chrome-launcher");

const puppeteer = (await import("puppeteer")).default;
const lighthouse = (await import("lighthouse")).default;
const chromeLauncher = await import("chrome-launcher");

const loginRes = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json" },
  body: JSON.stringify({ email, password }),
});
if (!loginRes.ok) throw new Error(`Login HTTP ${loginRes.status}`);
const loginPayload = await loginRes.json();
const session = loginPayload.data ?? loginPayload;
if (!session?.token || !session?.user?.role) {
  throw new Error("Login sin token/rol");
}

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
});

try {
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
    defaultViewport: null,
  });

  // Misma pestaña que usará Lighthouse: sembrar sesión ANTES del navigate.
  const page = (await browser.pages())[0] || (await browser.newPage());
  await page.setViewport({
    width: 412,
    height: 915,
    deviceScaleFactor: 2,
    isMobile: true,
  });
  await page.goto(APP_URL, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.evaluate((raw) => {
    sessionStorage.setItem("wanka-session", raw);
    sessionStorage.setItem("wanka-page", "orders");
  }, JSON.stringify(session));

  const result = await lighthouse(APP_URL, {
    port: chrome.port,
    output: ["json", "html"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility"],
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      disabled: false,
    },
    disableStorageReset: true,
  });

  // Captura de la pantalla real auditada (post-Lighthouse).
  await page.bringToFront();
  await page.waitForFunction(
    () => document.body.innerText.includes("Pedidos"),
    { timeout: 60000 },
  );
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({
    path: path.join(outDir, "pantalla-pedidos.png"),
    fullPage: true,
  });

  const outBase = path.join(outDir, "lighthouse-pedidos");
  fs.writeFileSync(`${outBase}.report.json`, result.report[0]);
  fs.writeFileSync(`${outBase}.report.html`, result.report[1]);

  const lhr = result.lhr;
  const a = lhr.audits;
  const summary = {
    formFactor: "mobile",
    page: "Pedidos (autenticado)",
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    fcp: a["first-contentful-paint"]?.displayValue,
    lcp: a["largest-contentful-paint"]?.displayValue,
    tbt: a["total-blocking-time"]?.displayValue,
    cls: a["cumulative-layout-shift"]?.displayValue,
    transfer: a["total-byte-weight"]?.displayValue,
    bytes: a["total-byte-weight"]?.numericValue,
    finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl,
  };
  fs.writeFileSync(
    path.join(outDir, "lighthouse-pedidos-resumen.json"),
    JSON.stringify(summary, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
  await browser.disconnect();
} finally {
  await chrome.kill();
}
