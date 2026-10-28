import { expect, test } from "@playwright/test";
import { loginAsAdmin, openMenu } from "./helpers/auth.js";

test("un administrador registra un pedido eligiendo el punto en el mapa", async ({
  page,
}) => {
  const productName = `Carga prueba ${Date.now()}`;

  await loginAsAdmin(page);
  await openMenu(page, "Pedidos");
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
