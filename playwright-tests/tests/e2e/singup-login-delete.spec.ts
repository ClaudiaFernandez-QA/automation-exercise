import { test, expect } from '@playwright/test';
import { goToLogin } from '../../utils/navigate';
import { completeRegistration } from '../../utils/form-helper';
import { userData } from '../../tests-data/users';


test.describe('E2E - Signup + Logout + Login + Delete Account', () => {


  test('Registrar, cerrar sesión, volver a ingresar y eliminar cuenta', async ({ page }) => {
    await goToLogin(page);

    await test.step('1. Registrar nuevo usuario', async () => {
      await completeRegistration(page, userData);
      console.log('📩 Email generado:', userData.email);

    });

    await test.step('2. Logout del usuario', async () => {
      await page.getByRole('link', { name: 'Logout' }).click();
      await expect(page).toHaveURL('https://www.automationexercise.com/login');
    });

    await test.step('3. Login con las credenciales recién creadas', async () => {
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(userData.email);
      await page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Logged in as')).toContainText(userData.userName);
    });

    await test.step('4. Eliminar la cuenta', async () => {
      await page.getByRole('link', { name: ' Delete Account' }).click();
      await expect(page.getByText('Account Deleted!')).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
    });

    await test.step('5. Validar que ya no se puede hacer login con esa cuenta', async () => {
      await goToLogin(page);
      await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(userData.email);
      await page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });
  });
});
