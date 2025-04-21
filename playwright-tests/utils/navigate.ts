import { expect, Page } from '@playwright/test';

export async function goToHome(page: Page) {
  await page.goto('https://www.automationexercise.com/');
  await expect(page).toHaveTitle("Automation Exercise"); 
}


export const goToProducts = async (page: Page) => {
  await goToHome(page);
  await page.getByRole('link', { name: ' Products' }).click();
};

