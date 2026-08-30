'use strict';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function boolean(name, fallback) {
  const value = process.env[name];
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function integer(name, fallback) {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

const config = Object.freeze({
  bot: {
    username: required('MC_USERNAME'),
    password: process.env.MC_PASSWORD || undefined,
    auth: process.env.MC_AUTH || 'offline'
  },
  server: {
    host: required('MC_HOST'),
    port: integer('MC_PORT', 25565),
    version: process.env.MC_VERSION || false
  },
  reconnect: {
    enabled: boolean('AUTO_RECONNECT', true),
    baseDelayMs: integer('RECONNECT_BASE_DELAY_MS', 3000),
    maxDelayMs: integer('RECONNECT_MAX_DELAY_MS', 120000),
    connectionTimeoutMs: integer('CONNECTION_TIMEOUT_MS', 120000)
  },
  antiAfk: {
    enabled: boolean('ANTI_AFK_ENABLED', true),
    sneak: boolean('ANTI_AFK_SNEAK', false)
  },
  movement: {
    enabled: boolean('MOVEMENT_ENABLED', true),
    circleWalk: boolean('CIRCLE_WALK_ENABLED', true),
    radius: integer('CIRCLE_WALK_RADIUS', 4),
    intervalMs: integer('CIRCLE_WALK_INTERVAL_MS', 3000),
    lookAround: boolean('LOOK_AROUND_ENABLED', true),
    lookIntervalMs: integer('LOOK_AROUND_INTERVAL_MS', 5000),
    randomJump: boolean('RANDOM_JUMP_ENABLED', false),
    jumpIntervalMs: integer('RANDOM_JUMP_INTERVAL_MS', 10000)
  },
  auth: {
    enabled: boolean('AUTO_AUTH_ENABLED', false),
    password: process.env.AUTO_AUTH_PASSWORD || undefined
  },
  chat: {
    enabled: boolean('CHAT_ENABLED', false),
    messages: (process.env.CHAT_MESSAGES || '').split('|').map(s => s.trim()).filter(Boolean),
    intervalMs: integer('CHAT_INTERVAL_MS', 120000)
  },
  web: {
    enabled: boolean('WEB_ENABLED', true),
    host: process.env.WEB_HOST || '0.0.0.0',
    port: integer('PORT', 3000)
  }
});

if (config.auth.enabled && !config.auth.password) {
  throw new Error('AUTO_AUTH_PASSWORD is required when AUTO_AUTH_ENABLED=true');
}

module.exports = config;
