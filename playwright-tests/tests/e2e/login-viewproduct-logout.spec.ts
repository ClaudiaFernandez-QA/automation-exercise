import { test, expect } from '@playwright/test';
import { goToHome } from '../../utils/navigate';

test.describe('E2E - Login + View Product + Logout', () => {
  const name = 'E2E User';
  const email = `loginuser${Math.floor(Math.random() * 1000)}@testmail.com`;
  const password = 'qa123456';

  console.log('Email de prueba:', email);

  test('Crear cuenta, hacer login, ver producto y logout', async ({ page }) => {
    await goToHome(page);

    // PRECONDICIÓN: Registrar un nuevo usuario
    await test.step('1. Crear nuevo usuario', async () => {
      await page.getByRole('link', { name: 'Signup / Login' }).click();
      await page.getByRole('textbox', { name: 'Name' }).fill(name);
      await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('button', { name: 'Signup' }).click();

      await page.getByRole('radio', { name: 'Mr.' }).check();
      await page.getByRole('textbox', { name: 'Password *' }).fill(password);
      await page.selectOption('#days', '1');
      await page.selectOption('#months', '1');
      await page.selectOption('#years', '1990');
      await page.getByRole('textbox', { name: 'First name *' }).fill('Clau');
      await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
      await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Calle QA 123');
      await page.selectOption('#country', 'Canada');
      await page.getByRole('textbox', { name: 'State *' }).fill('Ontario');
      await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Toronto');
      await page.locator('#zipcode').fill('1234');
      await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.getByRole('link', { name: 'Continue' }).click();
      await page.getByRole('link', { name: 'Logout' }).click();
    });

    // Login
    await test.step('2. Hacer login con el usuario creado', async () => {
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('textbox', { name: 'Password' }).fill(password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Logged in as')).toContainText(name);
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
