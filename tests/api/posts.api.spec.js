const allure = require('allure-js-commons');
const { test, expect } = require('../../src/fixtures/test-fixtures');
const { registerHooks } = require('../../src/hooks/hooks');
const { readJson } = require('../../src/utils/dataReader');
const { validateSchema } = require('../../src/utils/schemaValidator');

const { defaults, cases } = readJson('api/posts.api.json');

// API project: no browser/page is requested by the hooks.
registerHooks(test, { ui: false });

test.describe('Posts API (data-driven from test-data/api/posts.api.json)', () => {
  for (const tc of cases) {
    test(`${tc.id} - ${tc.name}`, async ({ api }) => {
      await allure.epic('API Automation');
      await allure.feature(`${tc.method} /posts`);
      await allure.severity('critical');

      const res = await test.step(`${tc.method} ${tc.endpoint}`, () => api.send(tc.method, tc.endpoint, tc.payload));

      await test.step(`Status code is ${tc.expectedStatus}`, async () => {
        expect(res.status).toBe(tc.expectedStatus);
      });

      await test.step('Response headers are valid', async () => {
        expect(res.headers['content-type']).toContain(tc.expectedContentType || defaults.contentType);
      });

      await test.step('Response time is within the limit', async () => {
        expect(res.duration, `took ${res.duration}ms`).toBeLessThan(tc.maxResponseTimeMs || defaults.maxResponseTimeMs);
      });

      if (tc.schema) {
        await test.step(`Body matches JSON schema "${tc.schema}"`, async () => {
          const { valid, errors } = validateSchema(tc.schema, res.body);
          expect(valid, errors).toBe(true);
        });
      }

      if (tc.expectedArrayLength !== undefined) {
        await test.step(`Body contains ${tc.expectedArrayLength} items`, async () => {
          expect(res.body).toHaveLength(tc.expectedArrayLength);
        });
      }

      if (tc.expectedEveryItem) {
        await test.step('Every item matches the filter', async () => {
          for (const item of res.body) expect(item).toMatchObject(tc.expectedEveryItem);
        });
      }

      if (tc.expectedBody) {
        await test.step('Body contains the expected values', async () => {
          expect(res.body).toMatchObject(tc.expectedBody);
        });
      }
    });
  }
});
