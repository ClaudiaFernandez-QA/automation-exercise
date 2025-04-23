import { test, expect } from "@playwright/test";
import { goToHome } from "../utils/navigate";



test.describe("Funcionalidad Sidebar", () => {


    test.beforeEach(async ({ page }) => {
        await goToHome(page);
    });


    //--------------Funcionalidad: Category--------------

    test('Se muestra el título de Category', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Category' })).toBeVisible();
    });

    test('Se muestran cada una de las categorias', async ({ page }) => {
        const categories = page.locator('.category-products');
        await expect.soft(categories.getByRole('link', { name: ' Women' }), "Falta link Women").toBeVisible();
        await expect.soft(categories.getByRole('link', { name: ' Men' }), "Falta link Men").toBeVisible();
        await expect.soft(categories.getByRole('link', { name: ' Kids' }), "Falta link Kids").toBeVisible();
    })

    test('Se muestra cada producto dentro de la categoría Women', async ({ page }) => {
        const linkWomen = page.getByRole('link', { name: ' Women' });
        await linkWomen.click();

        const subCategories = page.locator('#Women ul');

        await expect(subCategories.getByRole('link', { name: 'Dress' })).toBeVisible();
        await expect(subCategories.getByRole('link', { name: 'Tops' })).toBeVisible();
        await expect(subCategories.getByRole('link', { name: 'Saree' })).toBeVisible();

        await linkWomen.click();
    });

    test('Se muestra cada producto dentro de la categoría Men', async ({ page }) => {
        const linkMen = page.getByRole('link', { name: ' Men' });
        await linkMen.click();

        const subCategories = page.locator('#Men ul');

        await expect(subCategories.getByRole('link', { name: 'Tshirts' })).toBeVisible();
        await expect(subCategories.getByRole('link', { name: 'Jeans' })).toBeVisible();

        await linkMen.click();
    });

    test('Se muestra cada producto dentro de la categoría Kids', async ({ page }) => {
        const linkKids = page.getByRole('link', { name: ' Kids' });
        await linkKids.click();

        const subCategories = page.locator('#Kids ul');

        await expect(subCategories.getByRole('link', { name: 'Dress' })).toBeVisible();
        await expect(subCategories.getByRole('link', { name: 'Tops & Shirts' })).toBeVisible();

        await linkKids.click();
    });


    test('Solo se muestra una categoría expandida a la vez', async ({ page }) => {
        const linkMen = page.getByRole('link', { name: ' Men' });
        const linkKids = page.getByRole('link', { name: ' Kids' });


        await linkMen.click();
        const panelMen = page.locator('#Men');
        await expect(panelMen).toHaveClass(/in/); // clase "in" indica que está expandido


        await linkKids.click();
        const panelKids = page.locator('#Kids');

        await expect(panelKids).toHaveClass(/in/);
        await expect(panelMen).not.toHaveClass(/in/);
    });

    test('Los productos listados tras seleccionar una subcategoría coinciden con la categoría', async ({ page }) => {

        // Configuración para testear distintas subcategorías
        const categories = [
            {
                categoryName: 'Women',
                product: 'Dress',
            },
            {
                categoryName: 'Men',
                product: 'Jeans',
            },
            {
                categoryName: 'Kids',
                product: 'Tops & Shirts',
            },
        ];

        for (const { categoryName, product } of categories) {

            await test.step(`Validar productos listados para "${categoryName} > ${product}"`, async () => {
                // Expandir categoría
                const categoryLink = page.getByRole('link', { name: ` ${categoryName}` });
                await categoryLink.click();

                // Hacer clic en subcategoría
                const subCategories = page.locator(`#${categoryName} ul`);
                await subCategories.getByRole('link', { name: product }).click();

                // Validar título
                await expect(page).toHaveTitle(new RegExp(`${product} Products`, 'i'));
                await expect(page.getByRole('heading', { name: `${categoryName} - ${product} Products` })).toBeVisible();

                // Validar productos
                const products = page.locator('.product-image-wrapper');
                const quantity = await products.count();
                expect(quantity).toBeGreaterThan(0);

                const firstProduct = products.first();


                const cardHasText = await firstProduct
                    .locator('.productinfo')
                    .getByText(new RegExp(product, 'i'))
                    .count();

                if (cardHasText > 0) {
                    expect(cardHasText).toBeGreaterThan(0);
                    console.log(`🔎 Se encontró "${product}" en la card `);
                } else {
                    console.log(`🔎 No encontró "${product}" en la card de "${categoryName}", va al detalle`);
                    await firstProduct.getByRole('link', { name: 'View Product' }).click();
                    await expect(page.locator('.product-information')).toContainText(new RegExp(product, 'i'));
                    await page.goBack();
                }


            });
        }


    });



    //--------------Funcionalidad: Brands-------------- 

    test('Se muestra el título de Brands', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Brands' })).toBeVisible();
    });

    test('Todas las marcas de muestran correctamente', async ({ page }) => {

        const allBrands = ['H&M', 'Polo', 'Madame', 'Mast & Harbour', 'Babyhug', 'Allen Solly Junior', 'Kookie Kids', 'Biba'];

        const brandsContainer = page.locator('.brands-name');

        for (const brand of allBrands) {
            await expect.soft(brandsContainer.getByRole('link', { name: new RegExp(brand, 'i') }),
                `Falta la marca ${brand}`).toBeVisible();
        }
    });

    test('Redirige correctamente a los productos de la marca seleccionada', async ({ page }) => {
        const marcas = ['Polo', 'H&M'];

        for (const marca of marcas) {
            await test.step(`Redirige correctamente por la marca seleccionada: ${marca}`, async () => {
                const linkMarca = page.getByRole('link', { name: new RegExp(marca, 'i') });
                await linkMarca.click();

                await expect(page).toHaveURL(new RegExp(`https://www.automationexercise.com/brand_products/${marca}`, 'i'));
                await expect(page.getByRole('heading', { name: `Brand - ${marca} Products` })).toBeVisible();

                await page.getByRole('link', { name: 'Home' }).click();
            });
        }
    });


    test('Los productos listados tras seleccionar una marca coinciden con la marca elegida', async ({ page }) => {

        const brands = ['Polo', 'H&M', 'Madame'];

        for (const brand of brands) {
            await test.step(`Validar productos listados para la marca "${brand}"`, async () => {

                const brandLink = page.getByRole('link', { name: new RegExp(brand, 'i') });
                await brandLink.click();


                const products = page.locator('.product-image-wrapper');
                const quantity = await products.count();
                expect(quantity).toBeGreaterThan(0);

                const primerProducto = products.first();

                await primerProducto.getByRole('link', { name: 'View Product' }).click();
                await expect(page.locator('.product-information')).toContainText(new RegExp(brand, 'i'));
                await page.goBack();

            });
        }

    });

});