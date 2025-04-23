import { test, expect } from '@playwright/test';
import { goToHome } from '../utils/navigate';


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

    test('La sección de productos contiene al menos un ítem visible', async ({ page }) => {

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

    //Validación visual del Sidebar
    // Las validaciones funcionales del sidebar se encuentran en `sidebar.spec.ts`

    test('Se visualiza correctamente el sidebar de categorías y marcas', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Category' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Brands' })).toBeVisible();
    });


    //Validaciones Funcionalidad: Recommended Items

    test('La sección "Recommended Items" muestra productos con su estructura completa', async ({ page }) => {
        const recommendedSection = page.locator('#recommended-item-carousel .item.active');

        await test.step('Se visualiza el título "RECOMMENDED ITEMS"', async () => {
            await expect(page.getByRole('heading', { name: 'recommended items' })).toBeVisible();
        });

        await test.step('Se muestra al menos un producto recomendado', async () => {
            const products = recommendedSection.locator('.product-image-wrapper');
            const quantityProducts = await products.count();
            expect(quantityProducts).toBeGreaterThan(0);
        });

        await test.step('Validar estructura del primer producto visible', async () => {
            const firstProduct = recommendedSection.locator('.product-image-wrapper').first();

            await expect(firstProduct.locator('img')).toBeVisible();
            await expect(firstProduct.locator('p')).toBeVisible();
            await expect(firstProduct.locator('h2')).toBeVisible();
            await expect(firstProduct.locator('.add-to-cart')).toBeVisible();

        });
    });


    test('La sección "Recommended Items" permite navegar entre slides', async ({ page }) => {
        const carrusel = page.locator('#recommended-item-carousel');
        const rightArrow = carrusel.locator('.right');

        const slideActive = carrusel.locator('.item.active .product-image-wrapper');
        const productsBefore = await slideActive.allTextContents();

        await test.step('Hacer clic en la flecha derecha para cambiar de slide', async () => {
            await rightArrow.click();
        });

        await test.step('Validar que cambió el contenido del carrusel', async () => {
            await expect.poll(async () => {
                const newProducts = await carrusel.locator('.item.active .product-image-wrapper').allTextContents();

                return newProducts;
            }, {
                timeout: 3000,
            }).not.toEqual(productsBefore);
        });
    });


    //Validación del Footer

    test('Sección Footer: permite suscribirse correctamente', async ({ page }) => {
        await test.step('Validar visualización del título "Subscription" y campo de email', async () => {
            await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
            await expect(page.getByText('Get the most recent updates from our site and be updated your self...')).toBeVisible();
            await expect(page.getByPlaceholder('Your email address')).toBeVisible();
        });

        await test.step('Completar email y enviar formulario', async () => {
            await page.getByPlaceholder('Your email address').fill('clau.tester@example.com');
            await page.getByRole('button', { name: '' }).click();
        });

        await test.step('Validar mensaje de éxito', async () => {
            await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
        });
    });



});