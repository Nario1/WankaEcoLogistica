import { expect, test } from "@playwright/test";
import {
  loginAsAdmin,
  loginAsDriver,
  openMenu,
} from "./helpers/auth.js";

test("flujo completo: vehículo, pedido, ruta optimizada y mapa del conductor", async ({
  page,
}) => {
  const stamp = Date.now();
  const plate = `R${stamp.toString().slice(-7)}`;
  const productName = `Carga E2E ${stamp}`;

  await loginAsAdmin(page);

  await openMenu(page, "Vehículos");
  await page.getByRole("button", { name: "Nuevo vehículo" }).click();
  await page.getByLabel("Placa").fill(plate);
  await page.getByLabel("Capacidad (kg)").fill("1000");
  await page.getByLabel("Consumo por km").fill("0.1");
  await page.getByLabel("Factor de emisión").fill("2.1");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByRole("row", { name: new RegExp(plate, "i") })).toBeVisible();

  await openMenu(page, "Pedidos");
  await page.getByRole("button", { name: "Nuevo pedido" }).click();
  await page.getByLabel("Producto o carga transportada").fill(productName);
  await page.getByLabel("Dirección o referencia").fill("Jr. Lima 450, Huancayo");
  await page.getByLabel("Peso (kg)").fill("15");
  const map = page.locator(".leaflet-container");
  await expect(map).toBeVisible();
  await map.click({ position: { x: 220, y: 180 } });
  await expect(page.getByText("Punto seleccionado:")).toBeVisible();
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(
    page.getByRole("row", { name: new RegExp(productName) }),
  ).toBeVisible();

  await openMenu(page, "Rutas");
  await page.getByRole("heading", { name: "Planificación de rutas" }).waitFor();
  await page.getByRole("button", { name: "Planificar nueva ruta" }).click();
  await expect(
    page.getByRole("heading", { name: "Nueva ruta operativa" }),
  ).toBeVisible();

  await page.getByLabel("Pedidos").click();
  await page.getByRole("option", { name: new RegExp(productName) }).click();
  await page.keyboard.press("Escape");

  await page.getByLabel("Conductor").click();
  await page.getByRole("option", { name: "Conductor Demo" }).click();

  await page.getByRole("button", { name: "Guardar" }).click();

  const routeRow = page.getByRole("row", { name: new RegExp(plate, "i") });
  await expect(routeRow).toBeVisible({ timeout: 45_000 });
  await expect(routeRow).toContainText("Conductor Demo");
  await expect(page.locator(".leaflet-container")).toBeVisible();

  await page.getByLabel("Cerrar sesión").click();
  await page.getByRole("button", { name: "Ingresar" }).waitFor();

  await loginAsDriver(page);
  await openMenu(page, "Mi ruta");
  await expect(
    page.getByRole("heading", { name: "Mi ruta en el mapa" }),
  ).toBeVisible();
  await expect(page.getByText("No tiene rutas asignadas")).toHaveCount(0);
  await expect(page.getByLabel("Ruta asignada")).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
});
