const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const { readJson } = require('../../src/utils/dataReader');

const users = readJson('ui/users.json');
const negativeCases = readJson('ui/login.json'); // data-driven: one test per JSON row

registerHooks(test, { ui: true });

test.describe('Login & Logout', () => {
  test.beforeEach(async () => {
    await allure.epic('UI Automation');
    await allure.feature('Authentication');
  });

  test('TC_LOGIN_01 - valid user can log in and log out', async ({ loginPage, inventoryPage, page }) => {
    await allure.severity('blocker');
    await test.step('Open the login page', () => loginPage.open());
    await test.step('Log in with valid credentials', () => loginPage.login(users.standard.username, users.standard.password));
    await test.step('Products page is displayed', async () => {
      await inventoryPage.waitUntilLoaded();
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(page).toHaveURL(/inventory\.html/);
    });
    await test.step('Log out', () => inventoryPage.logout());
    await test.step('Back on the login page', async () => {
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  for (const tc of negativeCases) {
    test(`${tc.id} - ${tc.title}`, async ({ loginPage, page }) => {
      await allure.severity('critical');
      await loginPage.open();
      await loginPage.login(tc.username, tc.password);
      expect(await loginPage.getErrorMessage()).toBe(tc.expectedError);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }
});
