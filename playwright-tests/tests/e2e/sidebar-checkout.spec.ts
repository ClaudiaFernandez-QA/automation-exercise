import { test, expect } from '@playwright/test';
import { goToHome } from '../../utils/navigate';


test.describe('E2E - Sidebar (Category + Brand) + Add to Cart + Checkout', () => {
    const name = 'Playwright Sidebar';
    const email = `sidebar${Math.floor(Math.random() * 1000)}@testmail.com`;
    const password = 'qa123456';

    const categoria = {
        nombre: 'Women',
        subcategoria: 'Tops'
    };
    const marca = 'Polo';

    test('Navegar por sidebar, agregar productos y hacer checkout', async ({ page }) => {
        await goToHome(page);

        // Paso 1 - Registro
        await test.step('Registrar usuario nuevo', async () => {
            await page.getByRole('link', { name: 'Signup / Login' }).click();
            await page.getByRole('textbox', { name: 'Name' }).fill(name);
            await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
            await page.getByRole('button', { name: 'Signup' }).click();

            await page.getByRole('radio', { name: 'Mr.' }).check();
            await page.getByRole('textbox', { name: 'Password *' }).fill(password);
            await page.selectOption('#days', '10');
            await page.selectOption('#months', '5');
            await page.selectOption('#years', '1990');
            await page.getByRole('textbox', { name: 'First name *' }).fill('Playwright');
            await page.getByRole('textbox', { name: 'Last name *' }).fill('Sidebar');
            await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Av QA 456');
            await page.selectOption('#country', 'Canada');
            await page.getByRole('textbox', { name: 'State *' }).fill('Ontario');
            await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Toronto');
            await page.locator('#zipcode').fill('1234');
            await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');
            await page.getByRole('button', { name: 'Create Account' }).click();
            await page.getByRole('link', { name: 'Continue' }).click();
        });

        // Paso 2 - Agregar producto desde Categoría
        await test.step(`Seleccionar subcategoría ${categoria.subcategoria}`, async () => {
            const linkCategoria = page.getByRole('link', { name: ` ${categoria.nombre}` });
            await linkCategoria.click();

            const subCategorias = page.locator(`#${categoria.nombre} ul`);
            await subCategorias.getByRole('link', { name: categoria.subcategoria }).click();

            const productosCategoria = page.locator('.product-image-wrapper');
            await productosCategoria.first().getByRole('link', { name: 'View Product' }).click();
            await page.getByRole('button', { name: 'Add to cart' }).click();
            await page.getByRole('button', { name: 'Continue Shopping' }).click();
        });

        // Paso 3 - Agregar producto desde Marca
        await test.step(`Seleccionar marca ${marca}`, async () => {
            const linkMarca = page.getByRole('link', { name: new RegExp(marca, 'i') });
            await linkMarca.click();

            const productosMarca = page.locator('.product-image-wrapper');
            await productosMarca.first().getByRole('link', { name: 'View Product' }).click();
            await page.getByRole('button', { name: 'Add to cart' }).click();
            await page.getByRole('link', { name: 'View Cart' }).click();
        });

        // Paso 4 - Checkout
        await test.step('Realizar checkout con los productos agregados', async () => {
            await page.getByText('Proceed To Checkout').click();
            await page.locator('textarea[name="message"]').fill('Gracias por los productos!');
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
