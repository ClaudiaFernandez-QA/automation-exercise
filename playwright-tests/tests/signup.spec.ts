import { expect, test } from '@playwright/test';
import { goToHome, goToLogin } from '../utils/navigate';


test.describe('Funcionalidad: Signup', () => {

  const randomNumber = Math.floor(Math.random() * 1000);
  const email = `prueba${randomNumber}@testmail.com`;
  const name = 'Automation Playwright';

  console.log("Mail de prueba: ", email);

  test.beforeEach(async ({ page }) => {
    await goToLogin(page);
  });

  test('Registrar un nuevo usuario con datos válidos', async ({ page }) => {

    await test.step('Completar nombre y email', async () => {

      await page.getByRole('textbox', { name: 'Name' }).fill(name);
      await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('button', { name: 'Signup' }).click();
    });

    await test.step('Validar redirección al formulario de creación de cuenta', async () => {

      await expect(page).toHaveURL('https://www.automationexercise.com/signup')
      await expect(page.getByText('Enter Account Information')).toBeVisible();

    });

    await test.step('Validar la estructura del formulario', async () => {

      await expect(page.getByText('Title')).toBeVisible();
      await expect(page.getByRole('radio', { name: 'Mr.' })).toBeVisible();
      await expect(page.getByRole('radio', { name: 'Mrs.' })).toBeVisible();

      await expect(page.getByText('Name *', { exact: true })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toBeVisible();

      await expect(page.getByText('Email *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Email *' })).toBeVisible();

      await expect(page.getByText('Password *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Password *' })).toBeVisible();

      await expect(page.getByText('Date of Birth')).toBeVisible();
      await expect(page.locator('#days')).toBeVisible();
      await expect(page.locator('#months')).toBeVisible();
      await expect(page.locator('#years')).toBeVisible();

      await expect(page.getByRole('checkbox', { name: 'Sign up for our newsletter!' })).toBeVisible();
      await expect(page.getByText('Sign up for our newsletter!')).toBeVisible();

      await expect(page.getByRole('checkbox', { name: 'Receive special offers from' })).toBeVisible();
      await expect(page.getByText('Receive special offers from')).toBeVisible();

      await expect(page.getByText('Address Information')).toBeVisible();

      await expect(page.getByText('First name *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'First name *' })).toBeVisible();

      await expect(page.getByText('Last name *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Last name *' })).toBeVisible();

      await expect(page.getByText('Company', { exact: true })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Company', exact: true })).toBeVisible();

      await expect(page.getByText('(Street address, P.O. Box,')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Address * (Street address, P.' })).toBeVisible();

      await expect(page.getByText('Address 2')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Address 2' })).toBeVisible();

      await expect(page.getByText('Country *')).toBeVisible();
      await expect(page.getByLabel('Country *')).toBeVisible();

      await expect(page.getByText('State *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'State *' })).toBeVisible();

      await expect(page.getByText('City *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'City * Zipcode *' })).toBeVisible();

      await expect(page.getByText('Zipcode *')).toBeVisible();
      await expect(page.locator('#zipcode')).toBeVisible();

      await expect(page.getByText('Mobile Number *')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Mobile Number *' })).toBeVisible();

      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();


    })

    await test.step('Validar que los datos que se visualizan sean iguales a los ingresados', async () => {

      await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toHaveValue(name);
      await expect(page.getByRole('textbox', { name: 'Email *' })).toHaveValue(email);

    })

    await test.step('Completar formulario y crear la cuenta', async () => {
      await page.getByRole('radio', { name: 'Mrs.' }).check();
      await page.getByRole('textbox', { name: 'Password *' }).fill('123456');

      await page.selectOption('#days', '20');
      await page.selectOption('#months', '8');
      await page.selectOption('#years', '1994');

      await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
      await page.getByRole('checkbox', { name: 'Receive special offers from' }).check();

      await page.getByRole('textbox', { name: 'First name *' }).fill('Prueba');
      await page.getByRole('textbox', { name: 'Last name *' }).fill('Automation');
      await page.getByRole('textbox', { name: 'Company', exact: true }).fill('QA Power');
      await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('Av Siempre Viva 123');
      await page.getByRole('textbox', { name: 'Address 2' }).fill('Depto 4C');

      await page.selectOption('#country', 'Canada');
      await page.getByRole('textbox', { name: 'State *' }).fill('Terranova y Labrador');
      await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Gander');
      await page.locator('#zipcode').fill('M5H2N2');
      await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1144556677');

      await page.getByRole('button', { name: 'Create Account' }).click();
    });

    await test.step('Validar cuenta creada y redirección', async () => {
      await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page.getByText('Logged in as')).toContainText(name);

      //Cerramos sesión
      await page.getByRole('link', { name: ' Logout' }).click();
    });

    await test.step('Completar nombre y email con uno ya registrado', async () => { 
      await page.getByRole('textbox', { name: 'Name' }).fill(name);
      await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
      await page.getByRole('button', { name: 'Signup' }).click();
    });

    await test.step('Validar mensaje de error por email ya registrado', async () => {
      await expect(page.getByText('Email Address already exist!')).toBeVisible();
    });

  });

});