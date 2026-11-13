/**
 * Genera HTML + PNG de la auditoría desktop oficial a partir del JSON existente.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const evidencias = path.join(root, "..", "evidencias");
const jsonPath = path.join(evidencias, "lighthouse-despues-desktop.report.json");
const htmlPath = path.join(evidencias, "lighthouse-despues-desktop.report.html");
const pngPath = path.join(evidencias, "lighthouse-despues-desktop.png");

if (!fs.existsSync(path.join(root, "node_modules", "lighthouse"))) {
  spawnSync("npm", ["install", "--no-save", "lighthouse", "puppeteer"], {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });
}

const { generateReport } = await import("lighthouse");
const lhr = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const html = generateReport(lhr, "html");
fs.writeFileSync(htmlPath, html);

const puppeteer = (await import("puppeteer")).default;
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await page.screenshot({ path: pngPath, fullPage: false });
await browser.close();
console.log("Wrote", pngPath);
