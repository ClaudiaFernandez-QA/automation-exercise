import { test, expect } from '@playwright/test';
import { goToHome } from '../../utils/navigate';


test.describe('E2E - Buscar producto + Agregar al carrito + Checkout', () => {
    const name = 'E2E Testing';
    const email = `busqueda${Math.floor(Math.random() * 1000)}@testmail.com`;
    const password = 'qa123456';
    const producto = 'jeans';

    test('Buscar un producto y completar proceso de compra', async ({ page }) => {
        await goToHome(page);

        // Paso 1 - Registro
        await test.step('Registrarse con usuario nuevo', async () => {
            await page.getByRole('link', { name: 'Signup / Login' }).click();
            await page.getByRole('textbox', { name: 'Name' }).fill(name);
            await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
            await page.getByRole('button', { name: 'Signup' }).click();

            await page.getByRole('radio', { name: 'Mr.' }).check();
            await page.getByRole('textbox', { name: 'Password *' }).fill(password);
            await page.selectOption('#days', '5');
            await page.selectOption('#months', '5');
            await page.selectOption('#years', '1990');
            await page.getByRole('textbox', { name: 'First name *' }).fill('E2E');
            await page.getByRole('textbox', { name: 'Last name *' }).fill('Testing');
            await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Av QA 123');
            await page.selectOption('#country', 'Canada');
            await page.getByRole('textbox', { name: 'State *' }).fill('Ontario');
            await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Toronto');
            await page.locator('#zipcode').fill('1234');
            await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');
            await page.getByRole('button', { name: 'Create Account' }).click();
            await page.getByRole('link', { name: 'Continue' }).click();
        });

        // Paso 2 - Buscar producto y agregarlo
        await test.step(`Buscar el producto "${producto}" y agregarlo al carrito`, async () => {
            await page.getByRole('link', { name: ' Products' }).click();
            await page.getByRole('textbox', { name: 'Search Product' }).fill(producto);
            await page.getByRole('button', { name: '' }).click();

            await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
            const productosEncontrados = page.locator('.product-image-wrapper');
            await expect(productosEncontrados.first()).toBeVisible();

            await productosEncontrados.first().getByRole('link', { name: 'View Product' }).click();
            await page.locator('#quantity').fill('2');
            await page.getByRole('button', { name: 'Add to cart' }).click();
            await page.getByRole('link', { name: 'View Cart' }).click();
        });

        // Paso 3 - Checkout
        await test.step('Realizar checkout', async () => {
            await page.getByText('Proceed To Checkout').click();
            await page.locator('textarea[name="message"]').fill('Por favor entregar rápido.');
            await page.getByRole('link', { name: 'Place Order' }).click();

            await page.locator('input[name="name_on_card"]').fill('E2E Testing');
            await page.locator('input[name="card_number"]').fill('4111111111111111');
            await page.getByRole('textbox', { name: 'ex.' }).fill('123');
            await page.getByRole('textbox', { name: 'MM' }).fill('12');
            await page.getByRole('textbox', { name: 'YYYY' }).fill('2026');

            await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
            await expect(page.getByRole('heading', { name: 'Order Placed!' })).toBeVisible();

        });
    });
});
