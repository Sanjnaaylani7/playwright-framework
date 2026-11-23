const fs = require('fs');
const os = require('os');
const config = require('../config/config');

/** Runs ONCE after all tests: writes the "Environment" widget shown on the Allure report overview. */
module.exports = async () => {
  const lines = [
    `UI.Base.URL=${config.baseUrl}`,
    `API.Base.URL=${config.apiBaseUrl}`,
    `Headless=${config.headless}`,
    `Node.Version=${process.version}`,
    `OS=${os.type()} ${os.release()}`,
    `Executed.At=${new Date().toISOString()}`,
  ];
  fs.mkdirSync(config.paths.allureResults, { recursive: true });
  fs.writeFileSync(`${config.paths.allureResults}/environment.properties`, lines.join('\n'));
  console.log('[global-teardown] environment.properties written');
};
