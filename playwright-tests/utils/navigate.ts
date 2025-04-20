import { expect, Page } from '@playwright/test';

export async function goToHome(page: Page) {
  await page.goto('https://www.automationexercise.com/');
  await expect(page).toHaveTitle("Automation Exercise"); 
}
