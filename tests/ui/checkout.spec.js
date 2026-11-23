const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const { readJson } = require('../../src/utils/dataReader');

const data = readJson('ui/checkout.json');

registerHooks(test, { ui: true });

test.describe('Checkout', () => {
  test.beforeEach(async () => {
    await allure.epic('UI Automation');
    await allure.feature('Checkout');
  });

  test('TC_CHK_01 - user can complete an end-to-end purchase', async ({ loggedInInventory: inventory, cartPage, checkoutPage }) => {
    await allure.severity('blocker');
    await test.step('Add products and open the cart', async () => {
      for (const product of data.products) await inventory.addToCart(product);
      await inventory.openCart();
    });
    await test.step('Proceed to checkout and enter customer details', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInformation(data.customer);
    });
    await test.step('Order summary lists the selected products', async () => {
      expect(await checkoutPage.getSummaryItemNames()).toEqual(data.products);
    });
    await test.step('Finish the order and verify confirmation', async () => {
      await checkoutPage.finish();
      expect(await checkoutPage.getConfirmationMessage()).toBe(data.successMessage);
    });
  });

  test(`TC_CHK_02 - ${data.validation.title}`, async ({ loggedInInventory: inventory, cartPage, checkoutPage }) => {
    await allure.severity('normal');
    await inventory.addToCart(data.singleProduct);
    await inventory.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(data.validation.customer);
    expect(await checkoutPage.getErrorMessage()).toBe(data.validation.expectedError);
  });
});
