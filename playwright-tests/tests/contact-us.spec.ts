import { test, expect } from '@playwright/test';
import { goToContactUs, goToHome } from '../utils/navigate';
import path from 'path';


test.describe("Funcionalidad: Contact Us ", () => {

    test.beforeEach(async ({ page }) => {
        await goToContactUs(page);
    });

    test('Acceder al formulario de Contact Us y validar estructura', async ({ page }) => {

        await test.step('Navegar desde el header hacia Contact us', async () => {
            await expect(page).toHaveURL(/contact_us/);
            await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
            await expect(page.getByText('Note: Below contact form is')).toBeVisible();
        });

        await test.step('Validar visualización de todos los campos del formulario', async () => {
            await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Subject' })).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Your Message Here' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        });
    });

    test('Completar y enviar formulario de Contact Us con archivo adjunto', async ({ page }) => {

        await test.step('Acceder a Contact us', async () => {
            await expect(page).toHaveURL(/contact_us/);
        });

        await test.step('Completar campos con información válida', async () => {
            await page.getByRole('textbox', { name: 'Name' }).fill('Test');
            await page.getByRole('textbox', { name: 'Email', exact: true }).fill('test@example.com');
            await page.getByRole('textbox', { name: 'Subject' }).fill('Consulta');
            await page.getByRole('textbox', { name: 'Your Message Here' }).fill('Hola! Esta es una prueba de formulario.');
        });

        await test.step('Adjuntar un archivo al formulario', async () => {
            const filePath = path.resolve(__dirname, '../fixtures/archivo_contact-us.txt');
            await page.getByRole('button', { name: 'Choose File' }).setInputFiles(filePath);
        });

        await test.step('Enviar el formulario y aceptar el alert', async () => {

            page.once('dialog', async (dialog) => {
                await dialog.accept();
            });

            await page.getByRole('button', { name: 'Submit' }).click();
        });

        await test.step('Validar mensaje de éxito y redirección con botón Home', async () => {
            await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
            await expect(page.locator('#contact-page').getByText('Success! Your details have')).toBeVisible();
            await page.getByRole('link', { name: ' Home' }).click();
            await expect(page).toHaveURL('https://www.automationexercise.com/');
        });
    });

    test('No permite enviar el formulario si el campo Email está vacío', async ({ page }) => {

        await test.step('Completar campos sin incluir el email', async () => {
            await page.getByRole('textbox', { name: 'Name' }).fill('Test sin email');
            await page.getByRole('textbox', { name: 'Subject' }).fill('Falta email');
            await page.getByRole('textbox', { name: 'Your Message Here' }).fill('Probando validación de campos vacíos');
        });

        await test.step('Intentar enviar formulario y validar que el botón no genera acción', async () => {
            const submitButton = page.getByRole('button', { name: 'Submit' });

            const dialogTriggered = await page
                .waitForEvent('dialog', { timeout: 1000 })
                .then(() => true)
                .catch(() => false);

            await submitButton.click();

            expect(dialogTriggered).toBe(false);
            await expect(page).toHaveURL(/contact_us/);
        });

    });


});