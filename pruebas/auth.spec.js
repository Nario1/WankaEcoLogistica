import { expect, test } from "@playwright/test";
import {
  adminEmail,
  adminPassword,
  login,
  loginAsAdmin,
  loginAsDriver,
} from "./helpers/auth.js";

test("el administrador inicia sesión y ve el inicio", async ({ page }) => {
  await loginAsAdmin(page);
  await expect(
    page.getByRole("heading", { name: "Operación logística" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Pedidos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Rutas" })).toBeVisible();
});

test("credenciales inválidas muestran error", async ({ page }) => {
  await login(page, adminEmail, "ClaveIncorrecta999");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
});

test("el conductor solo ve Inicio y Mi ruta", async ({ page }) => {
  await loginAsDriver(page);
  await expect(page.getByRole("button", { name: "Mi ruta" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pedidos" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Rutas" })).toHaveCount(0);
});
