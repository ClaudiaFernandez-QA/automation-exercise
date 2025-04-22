import { test, expect, Page } from '@playwright/test';
import { goToLogin } from '../utils/navigate';

test.describe("Funcionalidad: Login/Logout", () => {

    const name = 'QA Playwright';
    const email = `testuser${Math.floor(Math.random() * 1000)}@testmail.com`;
    const password = 'pass123456';

    console.log("mail de login: ", email);

    test.beforeEach(async ({ page }) => {
        await goToLogin(page);
    })

    test('Login/Logout exitoso con usuario registrado', async ({ page }) => {

        // ---------- PRECONDICIÓN: Crear el usuario ----------

        await test.step('Registrar un nuevo usuario', async () => {
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

            // Logout para luego probar login
            await page.getByRole('link', { name: 'Logout' }).click();

            // ----------FIN PRECONDICIÓN----------

        });

        await test.step('Iniciar sesión con las credenciales registradas', async () => {
            await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
            await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
            await page.getByRole('textbox', { name: 'Password' }).fill(password);
            await page.getByRole('button', { name: 'Login' }).click();

            await expect(page.getByText('Logged in as')).toContainText(name);
        });

        await test.step('Logout exitoso del usuario registrado', async () => {
            await page.getByRole('link', { name: 'Logout' }).click();
            await expect(page).toHaveURL('https://www.automationexercise.com/login');
            await expect(page.getByText('Logged in as')).not.toBeVisible();
            await expect(page.getByRole('link', { name: ' Delete Account' })).not.toBeVisible();
        });

    });

    test("Se elimina la cuenta del usuario creado", async ({ page }) => {

        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('link', { name: ' Delete Account' }).click();

        await expect(page.getByText('Account Deleted!')).toBeVisible();
        await expect(page).toHaveURL('https://www.automationexercise.com/delete_account');

        await page.getByRole('link', { name: 'Continue' }).click();

    });

    test('No se puede ingresar con la cuenta eliminada', async ({ page }) => {

        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Your email or password is')).toBeVisible();
    })

})
