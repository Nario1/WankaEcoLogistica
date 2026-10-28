import { expect, test } from "@playwright/test";
import { loginAsAdmin, openMenu } from "./helpers/auth.js";

test("el administrador registra un conductor", async ({ page }) => {
  const stamp = Date.now();
  const name = `Conductor ${String(stamp).replace(/\d/g, (digit) => "abcdefghij"[digit])}`;
  const email = `e2e.driver.${stamp}@wanka.local`;

  await loginAsAdmin(page);
  await openMenu(page, "Conductores");
  await page.getByRole("heading", { name: "Conductores" }).waitFor();
  await page.getByRole("button", { name: "Nuevo conductor" }).click();

  await page.getByLabel("Nombre completo").fill(name);
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña temporal").fill("WankaDriverE2E26");
  await page.getByRole("button", { name: "Guardar" }).click();

  const row = page.getByRole("row", { name: new RegExp(name) });
  await expect(row).toBeVisible();
  await expect(row).toContainText(email);
  await expect(row).toContainText("Disponible");
});
