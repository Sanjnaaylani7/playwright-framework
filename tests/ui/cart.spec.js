const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const { readJson } = require('../../src/utils/dataReader');

const data = readJson('ui/checkout.json');

registerHooks(test, { ui: true });

test.describe('Shopping Cart', () => {
  test.beforeEach(async () => {
    await allure.epic('UI Automation');
    await allure.feature('Shopping Cart');
  });

  test('TC_CART_01 - added products appear in the cart', async ({ loggedInInventory: inventory, cartPage }) => {
    await allure.severity('critical');
    for (const product of data.products) await inventory.addToCart(product);
    expect(await inventory.getCartCount()).toBe(data.products.length);
    await inventory.openCart();
    expect(await cartPage.getItemNames()).toEqual(data.products);
  });

  test('TC_CART_02 - a product can be removed from the cart', async ({ loggedInInventory: inventory, cartPage }) => {
    await allure.severity('normal');
    await inventory.addToCart(data.singleProduct);
    await inventory.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
    await cartPage.removeItem(data.singleProduct);
    expect(await cartPage.getItemCount()).toBe(0);
  });
});
