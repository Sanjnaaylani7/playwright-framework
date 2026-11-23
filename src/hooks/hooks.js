const fs = require('fs');
const logger = require('../utils/logger');
const { takeScreenshot } = require('../utils/screenshotUtil');

/**
 * Reusable hooks (setup & teardown) registered by every spec file:  registerHooks(test)
 *
 *  beforeAll  - once per file/worker: log suite start
 *  beforeEach - test initialisation: reset the per-test log buffer, log test start
 *  afterEach  - reporting integration + screenshot capture on failure, attach the logs to the report
 *  afterAll   - once per file/worker: log suite end
 *
 * Browser setup/closure itself is handled by Playwright fixtures: a fresh isolated
 * browser context + page is created for each test and closed automatically afterwards.
 */
function registerHooks(test, { ui = false } = {}) {
  test.beforeAll(async ({}, testInfo) => {
    logger.info(`===== SUITE START: ${testInfo.file.split(/[\\/]/).pop()} =====`);
  });

  test.beforeEach(async ({}, testInfo) => {
    logger.clearBuffer();
    logger.info(`--- TEST START: ${testInfo.title} (project: ${testInfo.project.name}) ---`);
  });

  // UI tests request `page` (so a screenshot can be taken); API tests must not, to avoid launching a browser.
  const afterEachBody = async (page, testInfo) => {
    const failed = testInfo.status !== testInfo.expectedStatus;
    logger.info(`--- TEST END: ${testInfo.title} -> ${testInfo.status.toUpperCase()} in ${testInfo.duration}ms ---`);

    // Screenshot on failure -> saved to /screenshots and attached to the Allure report
    if (page && failed) {
      try {
        const file = await takeScreenshot(page, testInfo.title);
        await testInfo.attach('screenshot-on-failure', { body: fs.readFileSync(file), contentType: 'image/png' });
      } catch (err) {
        logger.error(`Could not capture screenshot: ${err.message}`);
      }
    }

    // Execution log of this test -> attached to the report
    await testInfo.attach('execution-log', { body: logger.getBuffer(), contentType: 'text/plain' });
  };

  if (ui) test.afterEach(async ({ page }, testInfo) => afterEachBody(page, testInfo));
  else test.afterEach(async ({}, testInfo) => afterEachBody(null, testInfo));

  test.afterAll(async ({}, testInfo) => {
    logger.info(`===== SUITE END: ${testInfo.file.split(/[\\/]/).pop()} =====`);
  });
}

module.exports = { registerHooks };
