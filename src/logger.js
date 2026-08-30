'use strict';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[process.env.LOG_LEVEL || 'info'] ?? LEVELS.info;

function write(level, message, meta = {}) {
  if (LEVELS[level] < threshold) return;
  const context = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  console.log(`${new Date().toISOString()} [${level.toUpperCase()}] ${message}${context}`);
}

module.exports = {
  debug: (message, meta) => write('debug', message, meta),
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta)
};
