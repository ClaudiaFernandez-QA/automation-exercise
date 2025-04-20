import { test, expect, Page } from '@playwright/test';
import { goToHome } from '../utils/navigate';
import { log } from 'console';


test.describe("Funcionalidad: Home", () => {

    test.beforeEach(async ({ page }) => {
        await goToHome(page);
    });

    test("La página principal carga correctament", async ({ page }) => {
        await expect(page).toHaveTitle("Automation Exercise")
        await expect(page.getByRole('link', { name: 'Website for automation' })).toBeVisible();
    });

    test("Se visualizan los elementos del Header", async ({ page }) => {
        await expect.soft(page.getByRole('link', { name: 'Home' }), "El ítem 'Home' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Products' }), "El ítem 'Products' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Cart' }), "El ítem 'Cart' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Signup / Login' }), "El ítem 'Signup / Login' no esta presente").toBeVisible();
        await expect.soft(page.locator('ul.nav.navbar-nav').getByRole('link', { name: 'Test Cases' }), "El ítem 'Test Cases' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'API Testing' }), "El ítem 'API Testing' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Video Tutorials' }), "El ítem 'Video Tutorials' no esta presente").toBeVisible();
        await expect.soft(page.getByRole('link', { name: 'Contact us' }), "El ítem 'Contact us' no esta presente").toBeVisible();

    });

    test('Los 3 slides del carrusel muestran imagen y contenido correctamente', async ({ page }) => {

        const imagenesEsperadas = [
            '/static/images/home/girl2.jpg',
            '/static/images/home/girl1.jpg',
            '/static/images/home/girl3.jpg',
        ];

        for (let i = 0; i < imagenesEsperadas.length; i++) {
            await test.step(`El slide ${i + 1}: muestra correctamente su imagen y textos`, async () => {
                const slideActivo = page.locator('.carousel-inner');

                await expect(slideActivo.locator('img').nth(i)).toHaveAttribute('src', imagenesEsperadas[i]);
                await expect(slideActivo.getByText('Full-Fledged practice website for Automation Engineers').nth(i)).toBeVisible();
                await expect(slideActivo.getByText('All QA engineers can use this website for automation practice and API testing either they are at beginner or advance level. This is for everybody to help them brush up their automation skills.').nth(i)).toBeVisible();
                await expect(slideActivo.getByRole('button', { name: 'Test Cases' }).first()).toBeVisible();
                await expect(slideActivo.getByRole('button', { name: 'APIs list for practice' }).first()).toBeVisible();

                const softwareTestingLink = slideActivo.getByRole('link', { name: 'Software testing services' });
                //Sólo el primer slide tiene ese enlace
                if (i === 0) {
                    await expect(softwareTestingLink).toBeVisible();
                } else {
                    await expect(softwareTestingLink).toHaveCount(0);
                }

                // Avanzar al siguiente slide si no es el último
                if (i < imagenesEsperadas.length - 1) {
                    await page.locator('.right.control-carousel').click();
                    await expect(page.getByRole('img', { name: 'demo website for practice' }).first()).toHaveAttribute('src', imagenesEsperadas[i + 1]);
                }


            });
        }
    });


    test('Se muestra el título de "FEATURES ITEMS" ', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Features Items' })).toBeVisible();
    });

    test('La sección de productos contiene al menos un ítem visible', async ({page}) => {

        const productContainer = page.locator('.features_items');
        const cardContent = productContainer.locator('.product-image-wrapper');

        const quantityItems = await cardContent.count();
        expect(quantityItems).toBeGreaterThan(0);
    });

    test("Se muestra correctamente la estructura de los primero seis productos", async ({ page }) => {

        const productsCards = page.locator('.features_items .product-image-wrapper');

        const quantityItems = await productsCards.count();

        const maxItems = Math.min(6, quantityItems);

        for (let i = 0; i < maxItems; i++) {

            const productCard = productsCards.nth(i);
            await expect(productCard.locator('img')).toBeVisible();
            await expect(productCard.locator('.productinfo p')).toBeVisible();
            await expect(productCard.locator('.productinfo h2')).toBeVisible();
            await expect(productCard.locator('.add-to-cart').first()).toBeVisible();
            await expect(productCard.locator('.choose > .nav > li > a')).toBeVisible();
        }
    })

    test("Se muestra correctamente el overlay del primer producto al hacer hover", async ({ page }) => {
        const productCard = page.locator('.product-image-wrapper').first();
        await productCard.hover();

        const overlay = productCard.locator('.product-overlay');

        await expect(overlay.getByRole('heading', { name: 'Rs. 500' })).toBeVisible();
        await expect(overlay.getByText('Blue Top')).toBeVisible();
        await expect(overlay.locator('.overlay-content > .btn')).toBeVisible();

    });



    //Validaciones para la Funcionalidad Siderbar: Category

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

    test('Redirige correctamente a la subcategoría "Tops"', async ({ page }) => {
        const linkWomen = page.getByRole('link', { name: ' Women' });
        await linkWomen.click();

        const subCategories = page.locator('#Women ul');
        await subCategories.getByRole('link', { name: 'Tops' }).click();

        await expect(page).toHaveTitle('Automation Exercise - Tops Products');
        await expect(page.getByRole('heading', { name: 'Women - Tops Products' })).toBeVisible();
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


    //Validaciones para la Funcionalidad Siderbar: Brands

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

                await expect(
                    page.getByRole('heading', { name: `Brand - ${marca} Products` })
                ).toBeVisible();

                await page.getByRole('link', { name: 'Home' }).click();
            });
        }
    });



});