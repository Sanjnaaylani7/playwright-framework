const logger = require('../utils/logger');
const wait = require('../utils/waitUtil');
const { takeScreenshot } = require('../utils/screenshotUtil');
const { handleNextDialog } = require('../utils/dialogUtil');

/** Parent of every page object: generic, reusable browser actions. */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(path = '/') {
    logger.info(`Navigate to: ${path}`);
    await this.page.goto(path);
  }

  async click(locator, description = '') {
    logger.info(`Click ${description}`);
    await locator.click();
  }

  async type(locator, text, description = '') {
    logger.info(`Type into ${description}`);
    await locator.fill(text);
  }

  async getText(locator) {
    return (await locator.innerText()).trim();
  }

  async getTexts(locator) {
    return (await locator.allInnerTexts()).map((t) => t.trim());
  }

  async isVisible(locator) {
    return locator.isVisible();
  }

  async selectOption(locator, value) {
    await locator.selectOption(value);
  }

  async waitForVisible(locator, timeout) {
    await wait.waitForVisible(locator, timeout);
  }

  async waitForUrl(urlOrRegex, timeout) {
    await wait.waitForUrl(this.page, urlOrRegex, timeout);
  }

  async screenshot(name) {
    return takeScreenshot(this.page, name);
  }

  /** Call BEFORE the action that opens an alert/confirm/prompt. */
  acceptNextDialog(promptText) {
    return handleNextDialog(this.page, { action: 'accept', promptText });
  }

  dismissNextDialog() {
    return handleNextDialog(this.page, { action: 'dismiss' });
  }

  async getTitle() {
    return this.page.title();
  }

  getUrl() {
    return this.page.url();
  }
}

module.exports = BasePage;
