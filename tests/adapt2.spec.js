const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
const { fail } = require('assert');

const baseUrl = 'https://magento.softwaretestingboard.com/'; 

test.describe('User Registration Test', () => {
  let browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  async function runTest(browserType) {
    let context;

    test.beforeEach(async () => {
      context = await browser.newContext();
    });

    test.afterEach(async () => {
      await context.close();
    });

    test(`should successfully register a user in ${browserType.name()}`, async ({ page }) => {
      // Navigate to the registration page
      await page.goto(`${baseUrl}`);
      await page.click('a[href="https://magento.softwaretestingboard.com/customer/account/create/"]');
      
      // Enter credentials in both password and username fields
      await page.fill('[name="firstname"]', 'dimtest');
      await page.fill('[name="lastname"]', 'Usertest');
      await page.fill('[name="email"]', 'dimmittestuser97@example.com');
      await page.fill('[name="password"]', 'StrongPassword123');
      await page.fill('[name="password_confirmation"]', 'StrongPassword123');

      // Click the "Create an Account" button
      await page.click('[title="Create an Account"]');

      // Wait for the success message element to appear
      const successMessageSelector = '[role="alert"] div';
      await page.waitForSelector(successMessageSelector, { timeout: 5000 });

      // Verify success message
      const successMessageElement = await page.getByRole('alert').locator('div').first(); 
      expect(successMessageElement).toContainText('Thank you for registering');
      
    });
}
  [chromium].forEach((browserType) => runTest(browserType));
});
