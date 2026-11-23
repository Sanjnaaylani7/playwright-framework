const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../test-data');

/** Reads and parses a JSON file from /test-data. Example: readJson('ui/users.json') */
function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf-8'));
}

module.exports = { readJson };
