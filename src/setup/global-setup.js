const fs = require('fs');
const config = require('../config/config');

/** Runs ONCE before all tests: prepares clean output folders. */
module.exports = async () => {
  for (const dir of [config.paths.screenshots, config.paths.allureResults]) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.mkdirSync(config.paths.logs, { recursive: true });
  fs.writeFileSync(`${config.paths.logs}/execution.log`, ''); // fresh log per run
  console.log(`[global-setup] UI: ${config.baseUrl} | API: ${config.apiBaseUrl}`);
};
