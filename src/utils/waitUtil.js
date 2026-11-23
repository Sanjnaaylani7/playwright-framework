const { expect } = require('@playwright/test');
const logger = require('./logger');

/**
 * Wait helpers.
 *  - IMPLICIT waiting: Playwright auto-waits before every action; the limits are set globally
 *    in playwright.config.js (actionTimeout, navigationTimeout, expect.timeout).
 *  - EXPLICIT waiting: the helpers below, used when a specific condition must be awaited.
 */
async function waitForVisible(locator, timeout) {
  await locator.waitFor({ state: 'visible', timeout });
}

async function waitForHidden(locator, timeout) {
  await locator.waitFor({ state: 'hidden', timeout });
}

async function waitForUrl(page, urlOrRegex, timeout) {
  logger.debug(`Waiting for URL: ${urlOrRegex}`);
  await page.waitForURL(urlOrRegex, { timeout });
}

async function waitForText(locator, text, timeout) {
  await expect(locator).toContainText(text, { timeout });
}

async function waitForResponse(page, urlPart, timeout) {
  return page.waitForResponse((r) => r.url().includes(urlPart), { timeout });
}

async function waitForNetworkIdle(page, timeout) {
  await page.waitForLoadState('networkidle', { timeout });
}

module.exports = { waitForVisible, waitForHidden, waitForUrl, waitForText, waitForResponse, waitForNetworkIdle };
