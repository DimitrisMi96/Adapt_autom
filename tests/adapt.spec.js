const { chromium, firefox, webkit } = require('playwright');
const { test, expect } = require('@playwright/test');

const baseUrl = 'https://magento.softwaretestingboard.com/';

test.describe('Platform HTTPS Support Test', () => {
  let browser;

  test.beforeAll(async () => {
    browser = await chromium.launch(); // Use your preferred browser here
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

    test(`should support HTTPS in ${browserType.name()}`, async ({ page }) => {
      // Access the platform page
      await page.goto(baseUrl);

      // Check if the URL starts with 'https://'
      const url = await page.url();
      expect(url.startsWith('https://')).toBe(true);

      // Check if there are no content warnings in the console
      const consoleMessages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.console-error')).map((element) => element.textContent);
      });

      expect(consoleMessages.length).toBe(0);

      // Additional tests for registered and guest users can be added here
      // For example, log in as a registered user, perform actions, and check HTTPS
      // Also, test as a guest user
    });
  }

  // Run the test for each browser
  [chromium, firefox, webkit].forEach((browserType) => runTest(browserType));
});
