import { expect, test } from "@playwright/test";

const email = process.env.PLAYWRIGHT_EMAIL ?? "admin@wanka.local";
const password = process.env.PLAYWRIGHT_PASSWORD ?? "WankaAdmin2026";

test("un administrador registra un pedido eligiendo el punto en el mapa", async ({
  page,
}) => {
  const productName = `Carga prueba ${Date.now()}`;

  await page.goto("/");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await page.getByRole("button", { name: "Pedidos" }).click();
  await page.getByRole("heading", { name: "Pedidos" }).waitFor();
  await page.getByRole("button", { name: "Nuevo pedido" }).click();

  await page.getByLabel("Producto o carga transportada").fill(productName);
  await page.getByLabel("Dirección o referencia").fill("Av. Ferrocarril 123");
  await page.getByLabel("Peso (kg)").fill("12");

  const map = page.locator(".leaflet-container");
  await expect(map).toBeVisible();
  await map.click();
  await expect(page.getByText("Punto seleccionado:")).toBeVisible();

  await page.getByRole("button", { name: "Guardar" }).click();

  const row = page.getByRole("row", { name: new RegExp(productName) });
  await expect(row).toBeVisible();
  await expect(row).toContainText("Av. Ferrocarril 123");
  await expect(row).toContainText("12 kg");
  await expect(row).toContainText("Normal");
});
