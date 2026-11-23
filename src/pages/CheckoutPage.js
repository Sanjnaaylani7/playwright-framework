const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillInformation({ firstName, lastName, postalCode }) {
    await this.type(this.firstName, firstName, 'first name');
    await this.type(this.lastName, lastName, 'last name');
    await this.type(this.postalCode, postalCode, 'postal code');
    await this.click(this.continueButton, 'continue button');
  }

  async getErrorMessage() {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  async getSummaryItemNames() {
    return this.getTexts(this.summaryItemNames);
  }

  async getSubtotal() {
    return parseFloat((await this.getText(this.subtotal)).replace(/[^0-9.]/g, ''));
  }

  async finish() {
    await this.click(this.finishButton, 'finish button');
  }

  async getConfirmationMessage() {
    await this.waitForVisible(this.completeHeader);
    return this.getText(this.completeHeader);
  }
}

module.exports = CheckoutPage;
