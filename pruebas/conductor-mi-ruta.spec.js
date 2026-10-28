import { expect, test } from "@playwright/test";
import { loginAsDriver, openMenu } from "./helpers/auth.js";

test("el conductor abre Mi ruta y ve el mapa", async ({ page }) => {
  await loginAsDriver(page);
  await openMenu(page, "Mi ruta");
  await expect(
    page.getByRole("heading", { name: "Mi ruta en el mapa" }),
  ).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
});

test("sin conexión se muestra el aviso de estado offline", async ({ page }) => {
  await loginAsDriver(page);
  await openMenu(page, "Mi ruta");
  await page.getByRole("heading", { name: "Mi ruta en el mapa" }).waitFor();

  await page.context().setOffline(true);
  await expect(page.getByText(/Sin conexión/i)).toBeVisible();
  await page.context().setOffline(false);
});

