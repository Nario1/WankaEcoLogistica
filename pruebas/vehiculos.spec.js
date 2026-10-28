import { expect, test } from "@playwright/test";
import { loginAsAdmin, openMenu } from "./helpers/auth.js";

test("el administrador registra un vehículo", async ({ page }) => {
  const plate = `T${Date.now().toString().slice(-7)}`;

  await loginAsAdmin(page);
  await openMenu(page, "Vehículos");
  await page.getByRole("heading", { name: "Vehículos" }).waitFor();
  await page.getByRole("button", { name: "Nuevo vehículo" }).click();

  await page.getByLabel("Placa").fill(plate);
  await page.getByLabel("Capacidad (kg)").fill("800");
  await page.getByLabel("Consumo por km").fill("0.12");
  await page.getByLabel("Factor de emisión").fill("2.3");
  await page.getByRole("button", { name: "Guardar" }).click();

  const row = page.getByRole("row", { name: new RegExp(plate, "i") });
  await expect(row).toBeVisible();
  await expect(row).toContainText("800 kg");
  await expect(row).toContainText("Disponible");
});
