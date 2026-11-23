// Central configuration. Values come from environment variables (.env or Jenkins/Docker) with safe defaults.
require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  headless: process.env.HEADLESS !== 'false',
  workers: Number(process.env.WORKERS || 2),
  retries: Number(process.env.RETRIES || 1),
  logLevel: process.env.LOG_LEVEL || 'info',
  timeouts: {
    test: 60000,
    expect: 10000,
    action: 15000,
    navigation: 30000,
  },
  paths: {
    screenshots: 'screenshots',
    logs: 'logs',
    allureResults: 'allure-results',
  },
};
