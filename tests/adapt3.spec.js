const { chromium } = require('playwright');
const { test, expect } = require('@playwright/test');
const { fail } = require('assert');

const baseUrl = 'https://magento.softwaretestingboard.com/'; 

test.describe('User Login and Search Product Test', () => {
  let browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  async function runTest(browserType) {
    let context;
    let page;

    test.beforeEach(async () => {
      context = await browser.newContext();
      page = await context.newPage();
    });

    test.afterEach(async () => {
      await context.close();
    });

    test(`should successfully login and search a product ${browserType.name()}`, async () => {

        await page.goto(`${baseUrl}`);
        // I have already registered with another user so i can use the credentials that i have
        // username :dimmittestuser98@example.com
        // password :StrongPassword123
        await login(page, 'dimmittestuser98@example.com', 'StrongPassword123');
        await page.waitForTimeout(5000);

        //type text in field
        const searchInputSelector = '#search';
        await page.waitForSelector(searchInputSelector, { timeout: 5000 });
        await page.type(searchInputSelector, 'Tee');

        //click search button
        const searchButtonSelector = 'button[type="submit"].action.search';
        await page.waitForSelector(searchButtonSelector, { timeout: 5000 });
        await page.click(searchButtonSelector);

        //await page.pause();
        await page.waitForTimeout(5000);
        // Wait for the product link to be present

        const productLinkSelector = 'a.product-item-link[href="https://magento.softwaretestingboard.com/layla-tee.html"]';
        await page.waitForSelector(productLinkSelector, { timeout: 5000 });

        // Get the text content of the product link
        const productLinkText = await page.textContent(productLinkSelector);

        // Perform an assertion that the text contains the word "Tee"
        expect(productLinkText.toLowerCase()).toContain('tee');
        
    });
  }

  [chromium].forEach((browserType) => runTest(browserType));

  async function login(page, email, password) {
    // Implement your login logic here
        await page.click('a[href="https://magento.softwaretestingboard.com/customer/account/login/referer/aHR0cHM6Ly9tYWdlbnRvLnNvZnR3YXJldGVzdGluZ2JvYXJkLmNvbS8%2C/"]');
        await page.fill('[name="login[username]"]', email);
        await page.fill('[name="login[password]"]', password);
        const submitButtonSelector = '#send2';
        await page.waitForSelector(submitButtonSelector, { timeout: 5000 });
        await page.click(submitButtonSelector);
  }
});
