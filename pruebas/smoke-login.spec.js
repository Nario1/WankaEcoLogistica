import { expect, test } from '@playwright/test';

test('pantalla de login visible en tres navegadores', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'WankaEcoLogística' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
});
