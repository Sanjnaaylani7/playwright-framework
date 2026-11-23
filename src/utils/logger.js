const fs = require('fs');
const path = require('path');
const winston = require('winston');
const Transport = require('winston-transport');
const config = require('../config/config');

fs.mkdirSync(config.paths.logs, { recursive: true });

// Keeps the log lines of the CURRENT test in memory so the hooks can attach them to the report.
// (Each Playwright worker is its own process and runs tests serially, so a module-level buffer is safe.)
const buffer = [];
class BufferTransport extends Transport {
  log(info, callback) {
    buffer.push(info[Symbol.for('message')]);
    callback();
  }
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
);

const logger = winston.createLogger({
  level: config.logLevel,
  format,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(config.paths.logs, 'execution.log') }),
    new BufferTransport(),
  ],
});

logger.clearBuffer = () => { buffer.length = 0; };
logger.getBuffer = () => buffer.join('\n');

module.exports = logger;
