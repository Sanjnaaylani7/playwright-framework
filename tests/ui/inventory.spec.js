const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const { readJson } = require('../../src/utils/dataReader');

const checkout = readJson('ui/checkout.json');

registerHooks(test, { ui: true });

test.describe('Inventory', () => {
  test.beforeEach(async () => {
    await allure.epic('UI Automation');
    await allure.feature('Product Catalogue');
  });

  test('TC_INV_01 - all products are displayed', async ({ loggedInInventory: inventory }) => {
    await allure.severity('normal');
    expect(await inventory.getProductCount()).toBe(checkout.expectedProductCount);
  });

  test('TC_INV_02 - sorting by price (low to high) orders the products', async ({ loggedInInventory: inventory }) => {
    await allure.severity('normal');
    await inventory.sortBy('lohi');
    const prices = await inventory.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
