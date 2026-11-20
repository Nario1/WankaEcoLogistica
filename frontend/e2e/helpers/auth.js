export const adminEmail =
  process.env.PLAYWRIGHT_EMAIL ?? "admin@wanka.local";
export const adminPassword =
  process.env.PLAYWRIGHT_PASSWORD ?? "WankaAdmin2026";
export const driverEmail =
  process.env.PLAYWRIGHT_DRIVER_EMAIL ?? "conductor@wanka.local";
export const driverPassword =
  process.env.PLAYWRIGHT_DRIVER_PASSWORD ?? "WankaDriver2026";

export async function login(page, email, password) {
  await page.goto("/");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

export async function loginAsAdmin(page) {
  await login(page, adminEmail, adminPassword);
  await page.getByRole("heading", { name: "Operación logística" }).waitFor();
}

export async function loginAsDriver(page) {
  await login(page, driverEmail, driverPassword);
  await page.getByRole("button", { name: "Mi ruta" }).waitFor();
}

export async function openMenu(page, name) {
  await page.getByRole("button", { name }).click();
}
