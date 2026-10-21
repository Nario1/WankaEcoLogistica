import { expect, test } from "@playwright/test";

const driverEmail =
  process.env.PLAYWRIGHT_DRIVER_EMAIL ?? "conductor@wanka.local";
const driverPassword =
  process.env.PLAYWRIGHT_DRIVER_PASSWORD ?? "WankaDriver2026";

test("el conductor abre Mi ruta y ve el mapa o el aviso sin asignaciones", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Correo electrónico").fill(driverEmail);
  await page.getByLabel("Contraseña").fill(driverPassword);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await page.getByRole("button", { name: "Mi ruta" }).click();
  await expect(
    page.getByRole("heading", { name: "Mi ruta en el mapa" }),
  ).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(
    page.getByText("No tiene rutas asignadas", { exact: false }),
  ).toBeVisible();
});

test("sin conexión se muestra el aviso de estado offline", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Correo electrónico").fill(driverEmail);
  await page.getByLabel("Contraseña").fill(driverPassword);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Mi ruta" }).click();
  await page.getByRole("heading", { name: "Mi ruta en el mapa" }).waitFor();

  await page.context().setOffline(true);
  await expect(page.getByText(/Sin conexión/i)).toBeVisible();
  await page.context().setOffline(false);
});
