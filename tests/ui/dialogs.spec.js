const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const BasePage = require('../../src/pages/BasePage');

registerHooks(test, { ui: true });

// Demonstrates the reusable alert / confirm handling helpers on a self-contained page
// (the demo shop has no native dialogs, so no external website is needed).
test('TC_UTIL_01 - alert and confirm dialogs are handled by the dialog utility', async ({ page }) => {
  await allure.epic('UI Automation');
  await allure.feature('Core Utilities');
  await allure.severity('minor');

  const base = new BasePage(page);
  await page.setContent(`
    <button id="alert" onclick="alert('Hello from alert')">Alert</button>
    <button id="confirm" onclick="document.title = confirm('Proceed?') ? 'accepted' : 'dismissed'">Confirm</button>`);

  const [alertText] = await Promise.all([base.acceptNextDialog(), page.click('#alert')]);
  expect(alertText).toBe('Hello from alert');

  await Promise.all([base.dismissNextDialog(), page.click('#confirm')]);
  expect(await page.title()).toBe('dismissed');
});
