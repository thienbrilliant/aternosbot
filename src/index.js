'use strict';

const config = require('./config');
const logger = require('./logger');
const { createState } = require('./state');
const { MinecraftBot } = require('./bot');
const { createWebServer } = require('./web');

const state = createState();
const minecraft = new MinecraftBot(config, state);
const webServer = createWebServer(config, state, () => minecraft.getBot());

minecraft.start();

function shutdown(signal) {
  logger.info('Shutdown requested', { signal });
  minecraft.stop();
  if (webServer) webServer.close(() => process.exit(0));
  else process.exit(0);
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

process.on('uncaughtException', error => {
  state.lastError = error.message;
  logger.error('Uncaught exception', { error: error.stack || error.message });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', reason => {
  state.lastError = String(reason);
  logger.error('Unhandled rejection', { reason: String(reason) });
});
