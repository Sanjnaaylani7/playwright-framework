const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { readJson } = require('./dataReader');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const cache = new Map(); // compiled validators, so each schema is compiled only once per worker

function getValidator(schemaName) {
  if (!cache.has(schemaName)) {
    cache.set(schemaName, ajv.compile(readJson(`schemas/${schemaName}.schema.json`)));
  }
  return cache.get(schemaName);
}

/**
 * Validates `data` against test-data/schemas/<schemaName>.schema.json.
 * Returns { valid, errors } so tests can assert with a readable message.
 */
function validateSchema(schemaName, data) {
  const validate = getValidator(schemaName);
  const valid = validate(data);
  return { valid, errors: valid ? '' : ajv.errorsText(validate.errors, { separator: '\n' }) };
}

module.exports = { validateSchema };
