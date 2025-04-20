import { expect, test } from "@playwright/test";
import { goToHome } from "../utils/navigate";

test.beforeEach(async ({ page }) => {
    await goToHome(page);
});

test.describe('Funcionalidad del Login', () => {

    test('Visualizamos el link "Signup / Login"', async ({page}) => {
        await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
    });

    test('Redirección al formulario de login', async({page})=> {
        await page.getByRole('link', { name: 'Signup / Login' }).click();
        await expect(page).toHaveTitle("Automation Exercise - Signup / Login");
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    });

    test('Visualización de campos del formulario de login', async({page})=>{
        await page.getByRole('link', { name: 'Signup / Login' }).click();
        await expect(page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    test('Login con credenciales inválidas', async({page})=>{
        await page.getByRole('link', { name: 'Signup / Login' }).click();
        await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill('usuario@prueba.com');
        await page.getByRole('textbox', { name: 'Password' }).fill('pass123');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    });

    test('Visualización de campos del formulario de Signup', async({page})=>{
        await page.getByRole('link', { name: 'Signup / Login' }).click();
        await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
        await expect(page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Signup' })).toBeVisible();
    });

    test('No hay redireccionamiento cuando los campos del Signup estan vacíos', async({page})=>{
        await page.getByRole('link', { name: 'Signup / Login' }).click();
        await page.getByRole('button', { name: 'Signup' }).click();
        await expect(page).toHaveURL("https://www.automationexercise.com/login");
    });

});