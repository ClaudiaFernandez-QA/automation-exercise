import { test, expect } from '@playwright/test';
import { goToProducts } from '../utils/navigate';


test.describe("Funcionalidad: Products ", () => {

    test.beforeEach(async ({ page }) => {
        await goToProducts(page);
    });

    test("La pagina Products carga correctamente", async ({ page }) => {

        await expect(page).toHaveURL('https://www.automationexercise.com/products');
        await expect(page).toHaveTitle('Automation Exercise - All Products');
        await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    });

    test("Se muestra la imagen Big Sale", async ({ page }) => {
        await expect(page.getByRole('img', { name: 'Website for practice' })).toBeVisible();
    })

    test('Se muestra al menos un producto', async ({ page }) => {

        const products = page.locator('.product-image-wrapper');
        const cantidad = await products.count();
        console.log(cantidad);

        expect(cantidad).toBeGreaterThan(0);

    });


    test('Valida la estructura del primer producto', async ({ page }) => {
        const producto = page.locator('.product-image-wrapper').first();

        await expect(producto.locator('img').first()).toBeVisible();
        await expect(producto.locator('p').first()).toBeVisible();
        await expect(producto.locator('h2').first()).toBeVisible();
        await expect(producto.locator('.add-to-cart').first()).toBeVisible();
        await expect(producto.locator(' .choose > .nav > li > a').first()).toBeVisible();
    });


    test('Buscar productos existentes muestra resultados esperados', async ({ page }) => {
        const products = ['jeans', 'dress'];

        for (const product of products) {
            await test.step(`Buscar el producto "${product}"`, async () => {
                await page.getByRole('textbox', { name: 'Search Product' }).fill(product);
                await page.getByRole('button', { name: '' }).click();
            });

            await test.step(`Validar resultados visibles para "${product}"`, async () => {
                await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

                const results = page.locator('.product-image-wrapper');
                const count = await results.count();
                expect(count).toBeGreaterThan(0);

                await expect(results.filter({ hasText: new RegExp(product, 'i') }).first(),
                    `Ningún producto visible contiene "${product}" en el nombre`
                ).toBeVisible();
            });

            // Vuelvo a la página original para la siguiente búsqueda
            await page.goto('https://www.automationexercise.com/products');
        }
    });

    test('Buscar un producto inexistente no muestra resultados', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Search Product' }).fill("jacket");
        await page.getByRole('button', { name: '' }).click();

        const resultados = page.locator('.product-image-wrapper');
        const cantidad = await resultados.count();

        expect(cantidad).toBe(0);

    });

    test('El detalle del primer producto coincide con el producto listado', async ({ page }) => {
        const primerProducto = page.locator('.product-image-wrapper').first();

        const nombreCard = await primerProducto.locator('p').first().innerText();
        const precioCard = await primerProducto.locator('h2').first().innerText();
        const imgCard = await primerProducto.locator('img').first().getAttribute('src');


        if (!nombreCard || !precioCard || !imgCard) {
            throw new Error('No se pudo obtener uno de los valores del producto');
        }

        await primerProducto.getByRole('link', { name: 'View Product' }).click();

        const productDetail = page.locator('.product-information');
        const productImage = page.locator('.view-product');

        await expect(productDetail).toContainText(nombreCard);
        await expect(productDetail).toContainText(precioCard);
        await expect(productImage.locator('img')).toHaveAttribute('src', imgCard);
    });

    test('Visualización completa del detalle del producto', async ({ page }) => {

        const firstProduct = page.locator('.product-image-wrapper').first();
        await firstProduct.getByRole('link', { name: 'View Product' }).click();

        const productDetail = page.locator('.product-details');

        await test.step('Validar imagen,nombre y categoria', async () => {
            await expect(productDetail.locator('img').first()).toBeVisible();
            await expect(productDetail.locator('h2').first()).toBeVisible();
            await expect(productDetail.locator('p').first()).toBeVisible();
        });

        await test.step('Validar información del producto', async () => {
            await expect(productDetail.getByText(/Rs./i)).toBeVisible();
            await expect(productDetail.getByText(/Availability:/i)).toBeVisible();
            await expect(productDetail.getByText(/Condition:/i)).toBeVisible();
            await expect(productDetail.getByText(/Brand:/i)).toBeVisible();
        });

        await test.step('Validar campo cantidad y botón Add to Cart', async () => {
            await expect(productDetail.locator('#quantity')).toBeVisible();
            await expect(productDetail.getByRole('button', { name: ' Add to cart' })).toBeVisible();
        });


    });

    test('Validar comportamiento del campo cantidad', async ({ page }) => {
        const firstProductCard = page.locator('.product-image-wrapper').first();
        await firstProductCard.getByRole('link', { name: 'View Product' }).click();

        const quantityInput = page.locator('#quantity');

        await test.step('Verificar que el valor por defecto sea "1"', async () => {
            await expect(quantityInput).toHaveValue('1');
        });

        await test.step('Asignar un número válido y verificar que se refleje', async () => {
            await quantityInput.fill('4');
            await expect(quantityInput).toHaveValue('4');
        });

        await test.step('Verificar que el input sea de tipo "number"', async () => {
            await expect(quantityInput).toHaveAttribute('type', 'number');
        });

        await test.step('Verificar que el valor mínimo permitido sea 1', async () => {
            await expect(quantityInput).toHaveAttribute('min', '1');
        });
    });

    test('Validar modal de confirmación al agregar un producto al carrito', async ({ page }) => {
        const firstProductCard = page.locator('.product-image-wrapper').first();
        await firstProductCard.getByRole('link', { name: 'View Product' }).click();

        const quantityInput = page.locator('#quantity');
        const addToCartButton = page.getByRole('button', { name: 'Add to cart' });

        await test.step('Asignar una cantidad y hacer clic en "Add to Cart"', async () => {
            await quantityInput.fill('2');
            await addToCartButton.click();
        });

        await test.step('Verificar que aparece el modal de confirmación', async () => {
            const modal = page.locator('#cartModal');

            await expect(modal).toBeVisible();
            await expect(modal.getByRole('heading', { name: 'Added!' })).toBeVisible();
            await expect(modal.getByText('Your product has been added')).toBeVisible();
            await expect(modal.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
            await expect(modal.getByRole('link', { name: 'View Cart' })).toBeVisible();
        });

        await test.step('Hacer clic en "Continue Shopping" y validar que se cierre el modal', async () => {
            await page.getByRole('button', { name: 'Continue Shopping' }).click();
            await expect(page.locator('#cartModal')).toBeHidden();
            await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
        });
    });













});