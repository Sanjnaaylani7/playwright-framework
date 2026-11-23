const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.navigateTo('/');
    await this.waitForVisible(this.loginButton);
  }

  /** Reusable login action. Credentials may be empty to test validation. */
  async login(username, password) {
    await this.type(this.usernameInput, username, 'username');
    await this.type(this.passwordInput, password, 'password');
    await this.click(this.loginButton, 'login button');
  }

  async getErrorMessage() {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }
}

module.exports = LoginPage;
