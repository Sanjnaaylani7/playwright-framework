const logger = require('../utils/logger');

/**
 * Thin wrapper over Playwright's APIRequestContext.
 * Every call is logged and returns { response, status, headers, body, duration } so tests can assert on all of them.
 */
class ApiClient {
  constructor(request) {
    this.request = request; // Playwright `request` fixture (APIRequestContext)
  }

  async send(method, endpoint, payload) {
    const options = { headers: { Accept: 'application/json' } };
    if (payload !== undefined && payload !== null) options.data = payload;

    logger.info(`API ${method} ${endpoint}${payload ? ` payload=${JSON.stringify(payload)}` : ''}`);
    const start = Date.now();
    const response = await this.request.fetch(endpoint, { method, ...options });
    const duration = Date.now() - start;

    let body = null;
    const text = await response.text();
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    logger.info(`API <- ${response.status()} in ${duration}ms`);
    return { response, status: response.status(), headers: response.headers(), body, duration };
  }

  get(endpoint) { return this.send('GET', endpoint); }
  post(endpoint, payload) { return this.send('POST', endpoint, payload); }
  put(endpoint, payload) { return this.send('PUT', endpoint, payload); }
  patch(endpoint, payload) { return this.send('PATCH', endpoint, payload); }
  delete(endpoint) { return this.send('DELETE', endpoint); }
}

module.exports = ApiClient;
