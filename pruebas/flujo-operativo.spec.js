import { expect, test } from "@playwright/test";
import { login, loginAsAdmin, openMenu } from "./helpers/auth.js";

test("flujo completo: vehículo, pedido, ruta optimizada y mapa del conductor", async ({
  page,
}) => {
  const stamp = Date.now();
  const plate = `R${stamp.toString().slice(-7)}`;
  const productName = `Carga E2E ${stamp}`;
  const driverName = `Conductor E2E ${stamp}`;
  const driverEmail = `e2e.flow.${stamp}@wanka.local`;
  const driverPassword = "WankaDriverE2E26";

  await loginAsAdmin(page);

  await openMenu(page, "Vehículos");
  await page.getByRole("button", { name: "Nuevo vehículo" }).click();
  await page.getByLabel("Placa").fill(plate);
  await page.getByLabel("Capacidad (kg)").fill("1000");
  await page.getByLabel("Consumo por km").fill("0.1");
  await page.getByLabel("Factor de emisión").fill("2.1");
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByRole("row", { name: new RegExp(plate, "i") })).toBeVisible();

  await openMenu(page, "Conductores");
  await page.getByRole("button", { name: "Nuevo conductor" }).click();
  await page.getByLabel("Nombre completo").fill(driverName);
  await page.getByLabel("Correo electrónico").fill(driverEmail);
  await page.getByLabel("Contraseña temporal").fill(driverPassword);
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByRole("row", { name: new RegExp(driverName) })).toBeVisible();

  await openMenu(page, "Pedidos");
  await page.getByRole("button", { name: "Nuevo pedido" }).click();
  await page.getByLabel("Producto o carga transportada").fill(productName);
  await page.getByLabel("Dirección o referencia").fill("Jr. Lima 450, Huancayo");
  await page.getByLabel("Peso (kg)").fill("15");
  await page.getByLabel("Inicio: hora").click();
  await page.getByRole("option", { name: "02", exact: true }).click();
  await page.getByLabel("Periodo").first().click();
  await page.getByRole("option", { name: "PM", exact: true }).click();
  await page.getByLabel("Fin: hora").click();
  await page.getByRole("option", { name: "04", exact: true }).click();
  await page.getByLabel("Periodo").nth(1).click();
  await page.getByRole("option", { name: "PM", exact: true }).click();
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
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("Vehículo recomendado").click();
  await page.getByRole("option", { name: new RegExp(plate, "i") }).click();

  await page.getByLabel("Conductor").click();
  await page.getByRole("option", { name: driverName }).click();

  await page.getByRole("button", { name: "Guardar" }).click();

  const routeRow = page.getByRole("row", { name: new RegExp(plate, "i") });
  await expect(routeRow).toBeVisible({ timeout: 45_000 });
  await expect(routeRow).toContainText(driverName);
  await expect(page.locator(".leaflet-container")).toBeVisible();

  await page.getByLabel("Cerrar sesión").click();
  await page.getByRole("button", { name: "Ingresar" }).waitFor();

  await login(page, driverEmail, driverPassword);
  await page.getByRole("button", { name: "Mi ruta" }).waitFor();
  await openMenu(page, "Mi ruta");
  await expect(
    page.getByRole("heading", { name: "Mi ruta en el mapa" }),
  ).toBeVisible();
  await expect(page.getByText("No tiene rutas asignadas")).toHaveCount(0);
  await expect(page.getByLabel("Ruta asignada")).toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
});
