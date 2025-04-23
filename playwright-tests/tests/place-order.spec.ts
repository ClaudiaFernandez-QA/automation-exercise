import { test, expect } from '@playwright/test';
import { goToHome } from '../utils/navigate';

test.describe('Funcionalidad: Place Order', () => {
    const userData = {
        name: 'Clau Tester',
        email: `placeorder${Math.floor(Math.random() * 1000)}@testmail.com`,
        password: 'qa123456',
        address: 'Av QA 123',
        country: 'Canada',
        state: 'Ontario',
        city: 'Toronto',
        zipcode: '1234',
        mobile: '1144556677',
    };

    console.log('Email de prueba:', userData.email);

    test('Completar proceso de compra desde Checkout hasta Order Placed', async ({ page }) => {
        await goToHome(page);

        // Paso 1: Registrarse
        await test.step('Registrarse con usuario nuevo', async () => {
            await page.getByRole('link', { name: 'Signup / Login' }).click();
            await page.getByRole('textbox', { name: 'Name' }).fill(userData.name);
            await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(userData.email);
            await page.getByRole('button', { name: 'Signup' }).click();

            await page.getByRole('radio', { name: 'Mrs.' }).check();
            await page.getByRole('textbox', { name: 'Password *' }).fill(userData.password);
            await page.selectOption('#days', '5');
            await page.selectOption('#months', '5');
            await page.selectOption('#years', '1990');
            await page.getByRole('textbox', { name: 'First name *' }).fill('Clau');
            await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
            await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(userData.address);
            await page.selectOption('#country', userData.country);
            await page.getByRole('textbox', { name: 'State *' }).fill(userData.state);
            await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(userData.city);
            await page.locator('#zipcode').fill(userData.zipcode);
            await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(userData.mobile);
            await page.getByRole('button', { name: 'Create Account' }).click();
            await page.getByRole('link', { name: 'Continue' }).click();
        });

        // Paso 2: Agregar producto
        await test.step('Agregar producto al carrito', async () => {
            const product = page.locator('.product-image-wrapper').nth(4);
            await product.getByRole('link', { name: 'View Product' }).click();
            await page.getByRole('button', { name: 'Add to cart' }).click();
            await page.getByRole('link', { name: 'View Cart' }).click();
        });

        // Paso 3: Ir al checkout
        await test.step('Proceder al checkout', async () => {
            await expect(page).toHaveURL(/view_cart/);
            await page.getByText('Proceed To Checkout').click();
            await expect(page).toHaveURL(/checkout/);
        });

        // Paso 4: Validar dirección de entrega y mensaje
        await test.step('Validar dirección de entrega y mensaje opcional', async () => {
            const delivery = page.locator('#address_delivery');

            await expect(delivery).toContainText(userData.name);
            await expect(delivery).toContainText(userData.address);
            await expect(delivery).toContainText(userData.country);
            await expect(delivery).toContainText(userData.state);
            await expect(delivery).toContainText(userData.city);
            await expect(delivery).toContainText(userData.mobile);

            await page.locator('textarea[name="message"]').fill('Por favor entregar por la mañana');
        });

        // Paso 5: Ingresar datos de tarjeta
        await test.step('Completar formulario de tarjeta y confirmar compra', async () => {
            await page.getByRole('link', { name: 'Place Order' }).click();
            await expect(page).toHaveURL(/payment/);
            await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible()
            await page.locator('input[name="name_on_card"]').fill('Clau QA');
            await page.locator('input[name="card_number"]').fill('1234567891234567');
            await page.getByRole('textbox', { name: 'ex.' }).fill('123');
            await page.getByRole('textbox', { name: 'MM' }).fill('12');
            await page.getByRole('textbox', { name: 'YYYY' }).fill('2025');
            await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
        });


        // Paso 6: Validar mensaje final y descarga de archivo
        await test.step('Verificar mensaje "Order Placed!" y descargar archivo', async () => {
            await expect(page.getByRole('heading', { name: 'Order Placed!' })).toBeVisible();
            await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

            const downloadPromise = page.waitForEvent('download');
            await page.getByRole('link', { name: 'Download Invoice' }).click();
            const download = await downloadPromise;
            console.log('📄 Archivo descargado:', await download.suggestedFilename());

            await page.getByRole('link', { name: 'Continue' }).click();
            await expect(page).toHaveURL('https://www.automationexercise.com/');
        });

    });
});
