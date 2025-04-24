import { test, expect } from '@playwright/test';
import { goToLogin } from '../../utils/navigate';
import { completeRegistration } from '../../utils/form-helper';
import { userData } from '../../tests-data/users';

test.describe('E2E - Login + View Product + Logout', () => {

  test('Crear cuenta, hacer login, ver producto y logout', async ({ page }) => {
    await goToLogin(page);

    // PRECONDICIÓN: Registrar un nuevo usuario
    await test.step('1. Crear nuevo usuario', async () => {
      await completeRegistration(page, userData);
      console.log('📩 Email generado:', userData.email);

      await page.getByRole('link', { name: 'Logout' }).click();
    });

    // Login
    await test.step('2. Hacer login con el usuario creado', async () => {
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(userData.email);
      await page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Logged in as')).toContainText(userData.userName);
    });

    // View Product
    await test.step('3. Ver detalle de un producto', async () => {
      const product = page.locator('.product-image-wrapper').first();
      await product.getByRole('link', { name: 'View Product' }).click();

      await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
      await expect(page.locator('.product-information')).toContainText('Rs. 500');
      await expect(page.locator('.product-information')).toContainText('Category');
    });

    // Logout
    await test.step('4. Logout y validación', async () => {
      await page.getByRole('link', { name: 'Logout' }).click();
      await expect(page).toHaveURL(/login/);
      await expect(page.getByText('Logged in as')).not.toBeVisible();
    });
  });
});
