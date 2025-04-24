import { Page, expect } from '@playwright/test';


export async function completeRegistration(page: Page, userData: {
    userName: string;
    email: string;
    password: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;

}) {
    await page.getByRole('textbox', { name: 'Name' }).fill(userData.userName);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(userData.email);
    await page.getByRole('button', { name: 'Signup' }).click();
    await page.getByRole('radio', { name: 'Mrs.' }).check();
    await page.getByRole('textbox', { name: 'Password *' }).fill(userData.password);
    await page.selectOption('#days', '20');
    await page.selectOption('#months', '8');
    await page.selectOption('#years', '1962');
    await page.getByRole('textbox', { name: 'First name *' }).fill(userData.firstName);
    await page.getByRole('textbox', { name: 'Last name *' }).fill(userData.lastName);
    await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(userData.address);
    await page.selectOption('#country', userData.country);
    await page.getByRole('textbox', { name: 'State *' }).fill(userData.state);
    await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill(userData.city);
    await page.locator('#zipcode').fill(userData.zipcode);
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(userData.phoneNumber);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('link', { name: 'Continue' }).click();

    await expect(page.getByText('Logged in as')).toContainText(userData.userName);
}

export async function completePayment(page: Page, cardData: {
    cardName: string,
    cardNumber: string,
    cardCvc: string,
    cardExpirationMonth: string,
    cardExpirationYear: string
}) {
    await page.getByRole('link', { name: 'Place Order' }).click();
    await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();

    await page.locator('input[name="name_on_card"]').fill(cardData.cardName);
    await page.locator('input[name="card_number"]').fill(cardData.cardNumber);
    await page.getByRole('textbox', { name: 'ex.' }).fill(cardData.cardCvc);
    await page.getByRole('textbox', { name: 'MM' }).fill(cardData.cardExpirationMonth);
    await page.getByRole('textbox', { name: 'YYYY' }).fill(cardData.cardExpirationYear);

    await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

    await expect(page.getByRole('heading', { name: 'Order Placed!' })).toBeVisible();
    await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

}