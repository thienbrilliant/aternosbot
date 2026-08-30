'use strict';

const logger = require('../logger');

function registerMovement(bot, config, timers) {
  if (!config.movement.enabled) return;

  if (config.movement.circleWalk) {
    let angle = 0;
    timers.setInterval(() => {
      if (!bot.entity) return;
      try {
        const { x, y, z } = bot.entity.position;
        const target = {
          x: Math.floor(x + Math.cos(angle) * config.movement.radius),
          y: Math.floor(y),
          z: Math.floor(z + Math.sin(angle) * config.movement.radius)
        };
        bot.lookAt(target, true).catch(() => {});
        bot.setControlState('forward', true);
        timers.setTimeout(() => bot.setControlState('forward', false), 900);
        angle += Math.PI / 4;
      } catch (error) {
        logger.debug('Circle movement failed', { error: error.message });
      }
    }, config.movement.intervalMs);
  }

  if (config.movement.lookAround) {
    timers.setInterval(() => {
      if (!bot.entity) return;
      bot.look(Math.random() * Math.PI * 2 - Math.PI, Math.random() * 0.6 - 0.3, true).catch(() => {});
    }, config.movement.lookIntervalMs);
  }

  if (config.movement.randomJump) {
    timers.setInterval(() => {
      try {
        bot.setControlState('jump', true);
        timers.setTimeout(() => bot.setControlState('jump', false), 250);
      } catch (error) {
        logger.debug('Random jump failed', { error: error.message });
      }
    }, config.movement.jumpIntervalMs);
  }
}

module.exports = { registerMovement };
