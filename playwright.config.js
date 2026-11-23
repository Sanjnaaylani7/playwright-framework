const { defineConfig, devices } = require('@playwright/test');
const config = require('./src/config/config');

module.exports = defineConfig({
  testDir: './tests',
  timeout: config.timeouts.test,
  expect: { timeout: config.timeouts.expect },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: config.retries,
  workers: config.workers,
  outputDir: 'test-results',
  globalSetup: require.resolve('./src/setup/global-setup'),
  globalTeardown: require.resolve('./src/setup/global-teardown'),

  reporter: [
    ['list'],
    ['allure-playwright', { resultsDir: config.paths.allureResults, detail: true, suiteTitle: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.baseUrl,
        headless: config.headless,
        actionTimeout: config.timeouts.action,         // implicit wait for every action
        navigationTimeout: config.timeouts.navigation, // implicit wait for page loads
        trace: 'retain-on-failure',
        video: 'off',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: config.apiBaseUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json; charset=UTF-8' },
      },
    },
  ],
});
