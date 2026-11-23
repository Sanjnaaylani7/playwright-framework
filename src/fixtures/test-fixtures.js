const base = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const ApiClient = require('../api/ApiClient');
const { readJson } = require('../utils/dataReader');

const users = readJson('ui/users.json');

/**
 * Custom test object. Page objects, the API client and a ready-logged-in session
 * are injected into tests as fixtures (dependency injection = no boilerplate in specs).
 */
const test = base.test.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  // Opens the site, logs in with the standard user and returns the inventory page.
  loggedInInventory: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.waitUntilLoaded();
    await use(inventoryPage);
  },

  api: async ({ request }, use) => use(new ApiClient(request)),
});

module.exports = { test, expect: base.expect };
