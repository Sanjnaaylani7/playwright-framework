const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
  }

  async getItemNames() {
    return this.getTexts(this.itemNames);
  }

  async getItemCount() {
    return this.items.count();
  }

  async removeItem(productName) {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await this.click(this.page.locator(`[data-test="remove-${id}"]`), `remove "${productName}"`);
  }

  async checkout() {
    await this.click(this.checkoutButton, 'checkout button');
  }
}

module.exports = CartPage;
