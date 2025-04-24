import { test, expect } from '@playwright/test';
import { goToLogin } from '../../utils/navigate';
import { completePayment, completeRegistration } from '../../utils/form-helper';
import { userData } from '../../tests-data/users';
import { cardData } from '../../tests-data/card-data';


test.describe('E2E - Buscar producto + Agregar al carrito + Checkout', () => {
    const producto = 'jeans';

    test('Buscar un producto y completar proceso de compra', async ({ page }) => {
        await goToLogin(page);

        // Paso 1 - Registro
        await test.step('Registrarse con usuario nuevo', async () => {
           await completeRegistration(page, userData);
           console.log('📩 Email generado:', userData.email);
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
            
            await completePayment(page,cardData);

        });
    });
});
