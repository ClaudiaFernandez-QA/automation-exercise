import { test, expect } from "@playwright/test";
import { goToCart, goToHome, goToProducts } from "../utils/navigate";



test.describe('Funcionalidad: Cart', () => {

    test('Navegar correctamente desde el Home hasta Cart', async ({ page }) => {

        await goToCart(page);
        await expect(page).toHaveURL('https://www.automationexercise.com/view_cart');
        await expect(page).toHaveTitle('Automation Exercise - Checkout');
    });

    test('Se muestra el mensaje "Cart is empty" si no se agregó ningun producto', async ({ page }) => {
        await goToCart(page);
        await expect(page.getByText('Cart is empty! Click here to')).toBeVisible;

    });

    test('Redirige correctamente desde Cart a Products a través del link "here"', async ({ page }) => {
        await goToCart(page);
        await page.getByRole('link', { name: 'here' }).click();
        await expect(page).toHaveURL('https://www.automationexercise.com/products');

    });


    test('Agregar un producto al carrito y verificar el contenido del Cart', async ({ page }) => {

        await goToProducts(page);
        const firstProduct = page.locator('.product-image-wrapper').first();
        await firstProduct.getByRole('link', { name: 'View Product' }).click();

        const quantityInput = page.locator('#quantity');
        await quantityInput.fill('2');

        await page.getByRole('button', { name: 'Add to cart' }).click();
        await expect(page.locator('#cartModal')).toBeVisible();

        await page.getByRole('link', { name: 'View Cart' }).click();

        await test.step('Verificar redirección al carrito', async () => {
            await expect(page).toHaveURL(/view_cart/);
            await expect(page.locator('#cart_info_table')).toBeVisible();
        });

        await test.step('Verificar contenido del producto en el carrito', async () => {
            const cartRow = page.locator('tr').nth(1);

            await expect(cartRow).toContainText('Blue Top');
            await expect(cartRow).toContainText('Rs. 500');
            await expect(cartRow).toContainText('2');
            await expect(cartRow).toContainText('Rs. 1000');
        });

        await test.step('Verificar botón de Proceed To Checkout', async () => {
            await expect(page.getByText('Proceed To Checkout')).toBeVisible();
        });
    });

    test('Eliminar un producto del carrito', async ({ page }) => {
        await goToProducts(page);

        const firstProduct = page.locator('.product-image-wrapper').first();
        await firstProduct.getByRole('link', { name: 'View Product' }).click();

        await page.locator('#quantity').fill('2');
        await page.getByRole('button', { name: 'Add to cart' }).click();
        await page.getByRole('link', { name: 'View Cart' }).click();

        const cartTable = page.locator('#cart_info_table');
        await expect(cartTable).toBeVisible();

        const deleteButton = cartTable.getByRole('cell', { name: '' }).locator('a');
        await deleteButton.click();

        await test.step('Esperar que se elimine y aparezca el mensaje de carrito vacío', async () => {
            await expect(page.getByText('Cart is empty! Click here to')).toBeVisible();
        });
    });

});


