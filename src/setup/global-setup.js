

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Empties a folder but keeps the folder itself (works with Docker-mounted volumes)
function cleanDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

/** Runs ONCE before all tests: prepares clean output folders. */
module.exports = async () => {
  cleanDir(config.paths.screenshots);
  cleanDir(config.paths.allureResults);
  fs.mkdirSync(config.paths.logs, { recursive: true });
  fs.writeFileSync(path.join(config.paths.logs, 'execution.log'), ''); // fresh log per run
  console.log(`[global-setup] UI: ${config.baseUrl} | API: ${config.apiBaseUrl}`);
};