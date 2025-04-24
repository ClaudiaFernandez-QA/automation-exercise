import { test, expect } from '@playwright/test';
import { goToLogin } from '../../utils/navigate';


test.describe('E2E - Signup + Logout + Login + Delete Account', () => {
  const name = 'QA Playwright';
  const email = `authuser${Math.floor(Math.random() * 1000)}@testmail.com`;
  const password = 'pass123456';

  console.log('📩 Email generado:', email);

  test('Registrar, cerrar sesión, volver a ingresar y eliminar cuenta', async ({ page }) => {
    await goToLogin(page);

    await test.step('1. Registrar nuevo usuario', async () => {
      await page.getByRole('textbox', { name: 'Name' }).fill(name);
      await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('button', { name: 'Signup' }).click();

      await page.getByRole('radio', { name: 'Mr.' }).check();
      await page.getByRole('textbox', { name: 'Password *' }).fill(password);
      await page.selectOption('#days', '10');
      await page.selectOption('#months', '5');
      await page.selectOption('#years', '1990');
      await page.getByRole('textbox', { name: 'First name *' }).fill('QA');
      await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
      await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Calle falsa 123');
      await page.selectOption('#country', 'Canada');
      await page.getByRole('textbox', { name: 'State *' }).fill('Buenos Aires');
      await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('La Plata');
      await page.locator('#zipcode').fill('1900');
      await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');

      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page.getByText('Logged in as')).toContainText(name);
    });

    await test.step('2. Logout del usuario', async () => {
      await page.getByRole('link', { name: 'Logout' }).click();
      await expect(page).toHaveURL('https://www.automationexercise.com/login');
    });

    await test.step('3. Login con las credenciales recién creadas', async () => {
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('textbox', { name: 'Password' }).fill(password);
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Logged in as')).toContainText(name);
    });

    await test.step('4. Eliminar la cuenta', async () => {
      await page.getByRole('link', { name: ' Delete Account' }).click();
      await expect(page.getByText('Account Deleted!')).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
    });

    await test.step('5. Validar que ya no se puede hacer login con esa cuenta', async () => {
      await goToLogin(page);
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('textbox', { name: 'Password' }).fill(password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });
  });
});
