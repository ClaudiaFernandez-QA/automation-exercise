import { test, expect } from '@playwright/test';
import { goToLogin } from '../../utils/navigate';
import { completePayment, completeRegistration } from '../../utils/form-helper';
import { userData } from '../../tests-data/users';
import { cardData } from '../../tests-data/card-data';

test.describe('E2E - Registro + Add to Cart + Checkout', () => {

  test('Registrar usuario, agregar al carrito y realizar checkout', async ({ page }) => {
    await goToLogin(page);

    await test.step('1 Navegar al formulario de registro', async () => {
      await completeRegistration(page, userData);
      console.log('📩 Email generado:', userData.email);
    });

    await test.step('2 Agregar un producto al carrito', async () => {
      const firstProduct = page.locator('.product-image-wrapper').first();
      await firstProduct.getByRole('link', { name: 'View Product' }).click();
      await page.getByRole('button', { name: 'Add to cart' }).click();
      await expect(page.locator('#cartModal')).toBeVisible();
      await page.getByRole('link', { name: 'View Cart' }).click();
    });

    await test.step('4 Iniciar proceso de checkout', async () => {
      await expect(page).toHaveURL(/view_cart/);
      await page.getByText('Proceed To Checkout').click();
      await expect(page).toHaveURL(/checkout/);
      await expect(page.locator('.checkout-information')).toBeVisible();
      await expect(page.locator('#address_delivery')).toContainText(userData.userName);
    });

    await test.step('5 Completar pago y finalizar la orden', async () => {
      await completePayment(page,cardData);
    });

    await test.step('6 Descargar factura y volver al Home', async () => {
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download Invoice' }).click();
      const download = await downloadPromise;
      console.log('✅ Archivo descargado:', await download.suggestedFilename());

      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page).toHaveURL('https://www.automationexercise.com/');
    });

  });
});
