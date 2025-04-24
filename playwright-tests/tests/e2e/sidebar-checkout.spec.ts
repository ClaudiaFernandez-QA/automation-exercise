import { test, expect } from '@playwright/test';
import { goToHome, goToLogin } from '../../utils/navigate';
import { compileFunction } from 'vm';
import { completePayment, completeRegistration } from '../../utils/form-helper';
import { userData } from '../../tests-data/users';
import { cardData } from '../../tests-data/card-data';


test.describe('E2E - Sidebar (Category + Brand) + Add to Cart + Checkout', () => {

    const categoria = {
        nombre: 'Women',
        subcategoria: 'Tops'
    };
    const marca = 'Polo';

    test('Navegar por sidebar, agregar productos y hacer checkout', async ({ page }) => {
        await goToLogin(page);

        // Paso 1 - Registro
        await test.step('Registrar usuario nuevo', async () => {
            await completeRegistration(page, userData);
            console.log('📩 Email generado:', userData.email);
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
           
            await completePayment(page,cardData);
        });
    });
});
