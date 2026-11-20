import { expect, test } from "@playwright/test";
import { loginAsAdmin, openMenu } from "./helpers/auth.js";

test.describe("Flujos principales de negocio", () => {
  test("navega Pedidos, Vehículos, Indicadores y Rutas", async ({ page }) => {
    await loginAsAdmin(page);

    await openMenu(page, "Pedidos");
    await expect(
      page.getByRole("heading", { name: /Pedidos/i }),
    ).toBeVisible();

    await openMenu(page, "Vehículos");
    await expect(
      page.getByRole("heading", { name: /Vehículos/i }),
    ).toBeVisible();

    await openMenu(page, "Indicadores");
    await expect(
      page.getByRole("heading", { name: /Indicadores|sostenibilidad/i }),
    ).toBeVisible();

    await openMenu(page, "Rutas");
    await expect(
      page.getByRole("heading", { name: "Planificación de rutas" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Planificar nueva ruta" }),
    ).toBeVisible();
  });
});
