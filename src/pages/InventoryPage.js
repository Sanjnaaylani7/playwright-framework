const BasePage = require('./BasePage');

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async waitUntilLoaded() {
    await this.waitForVisible(this.title);
  }

  async getProductCount() {
    return this.items.count();
  }

  async getProductNames() {
    return this.getTexts(this.itemNames);
  }

  async getProductPrices() {
    return (await this.getTexts(this.itemPrices)).map((p) => parseFloat(p.replace('$', '')));
  }

  /** @param {'az'|'za'|'lohi'|'hilo'} option */
  async sortBy(option) {
    await this.selectOption(this.sortDropdown, option);
  }

  async addToCart(productName) {
    await this.click(this.page.locator(`[data-test="add-to-cart-${slug(productName)}"]`), `add "${productName}"`);
  }

  async removeFromCart(productName) {
    await this.click(this.page.locator(`[data-test="remove-${slug(productName)}"]`), `remove "${productName}"`);
  }

  async getCartCount() {
    return (await this.cartBadge.isVisible()) ? Number(await this.getText(this.cartBadge)) : 0;
  }

  async openCart() {
    await this.click(this.cartLink, 'cart icon');
  }

  /** Reusable logout action (burger menu -> Logout). */
  async logout() {
    await this.click(this.menuButton, 'burger menu');
    await this.click(this.logoutLink, 'logout link');
  }
}

module.exports = InventoryPage;
