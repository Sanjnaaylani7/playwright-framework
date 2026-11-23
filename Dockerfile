# Official Playwright image: Node.js + Chromium/Firefox/WebKit + all OS dependencies already installed.
# The tag MUST match the @playwright/test version in package.json (1.65.1).
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app

# Install dependencies first (better Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the framework source
COPY . .

ENV CI=true \
    HEADLESS=true

# Runs UI + API tests, then generates the Allure report (see scripts/run-ci.js)
CMD ["node", "scripts/run-ci.js"]
