const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

const sanitize = (s) => s.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 80);

/** Takes a full-page screenshot, stores it in /screenshots and returns the file path. */
async function takeScreenshot(page, name = 'screenshot') {
  fs.mkdirSync(config.paths.screenshots, { recursive: true });
  const file = path.join(config.paths.screenshots, `${sanitize(name)}_${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  logger.info(`Screenshot saved: ${file}`);
  return file;
}

module.exports = { takeScreenshot };
