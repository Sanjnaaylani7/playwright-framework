# Playwright (JavaScript) Automation Framework

UI + API test automation framework built with **Playwright + JavaScript**, following the **Page Object Model**,
**data-driven testing (JSON)**, **Allure reporting**, and a **Docker + Jenkins** CI/CD pipeline.

| | |
|---|---|
| UI application under test | [Sauce Demo](https://www.saucedemo.com) - online shopping site (login, catalogue, cart, checkout) |
| API under test | [JSONPlaceholder](https://jsonplaceholder.typicode.com) - REST API (`/posts`: GET, POST, PUT, PATCH, DELETE) |
| Test cases | **20** (12 UI + 8 API) - within the 20 test-case limit |
| Tech | Playwright 1.65.1, Node.js 20+, Allure 3, Winston, Ajv, Docker, Jenkins |

See `docs/ARCHITECTURE.md` and `docs/architecture.png` for the architecture diagram and design explanation.

---

## 1. Project structure

```
.
├── tests/
│   ├── ui/                  login / inventory / cart / checkout / dialogs specs
│   └── api/                 posts.api.spec.js (data-driven GET/POST/PUT/PATCH/DELETE)
├── src/
│   ├── pages/               Page Objects: BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage
│   ├── api/ApiClient.js     wrapper over Playwright APIRequestContext
│   ├── fixtures/            custom `test` with page-object / api / logged-in fixtures
│   ├── hooks/hooks.js       beforeAll / afterAll / beforeEach / afterEach (screenshot on failure, log attach)
│   ├── setup/               global-setup.js, global-teardown.js
│   ├── utils/               logger, screenshotUtil, waitUtil, dialogUtil, dataReader, schemaValidator
│   └── config/config.js     URLs, timeouts, paths (from .env / environment variables)
├── test-data/
│   ├── ui/                  users.json, login.json, checkout.json
│   ├── api/                 posts.api.json  (endpoints, payloads, expected results)
│   └── schemas/             JSON schemas for response validation
├── scripts/run-ci.js        runs tests then always generates the Allure report (used by Docker/Jenkins)
├── Dockerfile
├── Jenkinsfile
├── playwright.config.js
└── docs/                    architecture diagram + documentation
```

## 2. Setup (local)

Prerequisites: **Node.js 20+** and **Git**. (Java is NOT needed - Allure 3 runs on Node.)

```bash
npm install
npx playwright install --with-deps chromium     # downloads the browser (one time)
cp .env.example .env                              # optional - defaults already work
```

## 3. Run the tests

```bash
npm test                 # all tests (UI + API)
npm run test:ui          # UI only
npm run test:api         # API only
npm run test:headed      # watch the browser while the UI tests run
npx playwright test -g "TC_LOGIN"      # run by name
```

## 4. Reports

```bash
npm run report:allure    # generate Allure report  -> allure-report/
npm run report:open      # open it in the browser
npm run report:html      # Playwright built-in HTML report (extra)
```

The Allure report contains: **test summary**, **pass/fail per test with steps**, **execution time**,
**screenshots of failures** (UI), the **execution log** of every test, and an **Environment** widget.
UI and API results are in the **same report**.

Screenshots are also saved to `screenshots/`, logs to `logs/execution.log`.

> To see a failure screenshot in the report, temporarily break an assertion (e.g. change `expectedError`
> in `test-data/ui/login.json`), run `npm run test:ui`, and generate the report.

## 5. Run in Docker

```bash
npm run docker:build
npm run docker:test      # results are written to ./allure-results, ./screenshots, ./logs
npm run report:allure && npm run report:open
```
(`docker:test` uses `$PWD`; on Windows PowerShell run:
`docker run --rm --ipc=host -v "${PWD}/allure-results:/app/allure-results" -v "${PWD}/screenshots:/app/screenshots" -v "${PWD}/logs:/app/logs" playwright-framework`)

## 6. Jenkins pipeline (Docker-based)

**One-time Jenkins setup**
1. Run Jenkins with Docker access, e.g.
   `docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts-jdk17`
   then install the Docker CLI inside it (`docker exec -u root jenkins sh -c "apt-get update && apt-get install -y docker.io"`).
   (Or install Jenkins directly on the machine that has Docker.)
2. Install plugins: **Pipeline**, **Git**, **GitHub**, **Allure Jenkins Plugin**.
3. Push this project to a GitHub repository.
4. Create a job: **New Item -> Pipeline -> "Pipeline script from SCM" -> Git -> your repo URL -> Script Path `Jenkinsfile`**.
5. Click **Build Now**. Take screenshots of: the successful stage view, the **Allure Report** link on the build page, and the console output.

**Triggers** (already in the `Jenkinsfile`)
- On code push: `githubPush()` - add a GitHub webhook `http://<jenkins-url>/github-webhook/` (needs a public URL, e.g. ngrok),
  or replace with `pollSCM('H/5 * * * *')` for local setups.
- On a schedule: `cron('H 2 * * *')` (nightly).

**Pipeline stages:** Checkout -> Build Docker Image -> Run UI & API tests in container -> Publish Allure report & archive
screenshots/logs -> Verify result.

## 7. Requirement coverage

| Requirement | Where |
|---|---|
| Application chosen | Sauce Demo (UI) + JSONPlaceholder (API) |
| Architecture diagram | `docs/architecture.png`, `docs/ARCHITECTURE.md` |
| Page Object Model | `src/pages/*` (BasePage + one class per page) |
| Data-driven (JSON) | `test-data/ui/*.json`, `test-data/api/posts.api.json` - tests are generated from the rows |
| Reporting (Allure) | `allure-playwright` reporter; summary, results, screenshots, time, logs |
| Core reusable methods | Login/Logout (`LoginPage`, `InventoryPage`), navigation (`BasePage.navigateTo`), waits (`waitUtil`), screenshots (`screenshotUtil`), alerts/popups (`dialogUtil`) |
| Utilities layer | `src/utils/*` |
| Hooks | `src/hooks/hooks.js` (beforeAll/afterAll/beforeEach/afterEach) + `src/setup/global-*` |
| API automation | `ApiClient` + `tests/api/*` - GET/POST/PUT/PATCH/DELETE; status, body, JSON schema (Ajv), headers, response time |
| Same report for UI + API | Both Playwright projects write to `allure-results/` |
| Docker | `Dockerfile` (official Playwright image) |
| Jenkins | `Jenkinsfile` (declarative) |
| Max 20 test cases | 20 |

### Test case list
UI: TC_LOGIN_01-05, TC_INV_01-02, TC_CART_01-02, TC_CHK_01-02, TC_UTIL_01  ·
API: API_GET_01-04, API_POST_01, API_PUT_01, API_PATCH_01, API_DELETE_01

## 8. Notes
- **Waits:** *implicit* = Playwright auto-wait + global timeouts in `playwright.config.js`; *explicit* = `src/utils/waitUtil.js`.
- JSONPlaceholder is a *fake* API: write requests (POST/PUT/PATCH/DELETE) return realistic responses but do not persist data.
- To test another site, change `BASE_URL` / `API_BASE_URL` in `.env` and replace the page objects + test data.
