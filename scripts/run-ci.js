// Used inside Docker/Jenkins: run all tests, ALWAYS generate the Allure report, then exit with the tests' exit code.
const { spawnSync } = require('child_process');
const run = (cmd, args) => spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });

const tests = run('npx', ['playwright', 'test', ...process.argv.slice(2)]);
run('npx', ['allure', 'generate', 'allure-results', '--output', 'allure-report', '--clean']);
process.exit(tests.status === null ? 1 : tests.status);
