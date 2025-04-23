import { test, expect } from '@playwright/test';
import { goToHome } from '../../utils/navigate';

test.describe('E2E - Registro + Add to Cart + Checkout', () => {
  const name = 'Prueba Playwright';
  const email = `e2e_user${Math.floor(Math.random() * 1000)}@testmail.com`;
  const password = 'qa123456';

  console.log("Email generado: ", email);

  test('Registrar usuario, agregar al carrito y realizar checkout', async ({ page }) => {

    await goToHome(page);

    await test.step('1 Navegar al formulario de registro', async () => {
      await page.getByRole('link', { name: 'Signup / Login' }).click();
      await page.getByRole('textbox', { name: 'Name' }).fill(name);
      await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('button', { name: 'Signup' }).click();
    });

    await test.step('2 Completar el formulario de registro', async () => {
      await page.getByRole('radio', { name: 'Mrs.' }).check();
      await page.getByRole('textbox', { name: 'Password *' }).fill(password);
      await page.selectOption('#days', '15');
      await page.selectOption('#months', '6');
      await page.selectOption('#years', '1990');
      await page.getByRole('textbox', { name: 'First name *' }).fill('Prueba');
      await page.getByRole('textbox', { name: 'Last name *' }).fill('Playwright');
      await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Av. QA 456');
      await page.selectOption('#country', 'Canada');
      await page.getByRole('textbox', { name: 'State *' }).fill('Ontario');
      await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Toronto');
      await page.locator('#zipcode').fill('M5H2N2');
      await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page.getByText('Logged in as')).toContainText(name);
    });

    await test.step('3 Agregar un producto al carrito', async () => {
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
      await expect(page.locator('#address_delivery')).toContainText(name);
    });

    await test.step('5 Completar pago y finalizar la orden', async () => {
        await page.getByRole('link', { name: 'Place Order' }).click();
  
        await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
  
        await page.locator('input[name="name_on_card"]').fill('Clau Tester');
        await page.locator('input[name="card_number"]').fill('4111111111111111');
        await page.getByRole('textbox', { name: 'ex.' }).fill('123');
        await page.getByRole('textbox', { name: 'MM' }).fill('12');
        await page.getByRole('textbox', { name: 'YYYY' }).fill('2026');
  
        await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
  
        await expect(page.getByRole('heading', { name: 'Order Placed!' })).toBeVisible();
        await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
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
