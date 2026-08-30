'use strict';

const logger = require('../logger');

function registerAntiAfk(bot, config, timers) {
  if (!config.antiAfk.enabled) return;

  timers.setInterval(() => {
    try { bot.swingArm(); } catch (error) { logger.debug('Unable to swing arm', { error: error.message }); }
  }, 15000);

  timers.setInterval(() => {
    try { bot.setQuickBarSlot(Math.floor(Math.random() * 9)); } catch (error) { logger.debug('Unable to change hotbar slot', { error: error.message }); }
  }, 60000);

  if (config.antiAfk.sneak) {
    try { bot.setControlState('sneak', true); } catch (error) { logger.debug('Unable to enable sneak', { error: error.message }); }
  }
}

module.exports = { registerAntiAfk };
