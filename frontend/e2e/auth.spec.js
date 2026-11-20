import { expect, test } from "@playwright/test";
import {
  adminEmail,
  login,
  loginAsAdmin,
  loginAsDriver,
} from "./helpers/auth.js";

test.describe("Autenticación y RBAC", () => {
  test("el administrador inicia sesión y ve el inicio", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(
      page.getByRole("heading", { name: "Operación logística" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Pedidos" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rutas" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Indicadores" }),
    ).toBeVisible();
  });

  test("credenciales inválidas muestran error", async ({ page }) => {
    await login(page, adminEmail, "ClaveIncorrecta999");
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
  });

  test("el conductor solo ve Inicio y Mi ruta", async ({ page }) => {
    test.skip(
      process.env.CI === "true" && process.env.PLAYWRIGHT_DRIVER_READY !== "1",
      "Requiere usuario conductor seed (PLAYWRIGHT_DRIVER_READY=1)",
    );
    await loginAsDriver(page);
    await expect(page.getByRole("button", { name: "Mi ruta" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pedidos" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Rutas" })).toHaveCount(0);
  });
});
