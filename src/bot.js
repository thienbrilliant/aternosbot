'use strict';

const mineflayer = require('mineflayer');
const minecraftData = require('minecraft-data');
const { createTimerRegistry } = require('./timers');
const { registerAntiAfk } = require('./modules/antiAfk');
const { registerMovement } = require('./modules/movement');
const logger = require('./logger');

class MinecraftBot {
  constructor(config, state) {
    this.config = config;
    this.state = state;
    this.bot = null;
    this.timers = createTimerRegistry();
    this.reconnectTimer = null;
    this.stopping = false;
  }

  start() {
    this.stopping = false;
    this.connect();
  }

  stop() {
    this.stopping = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.timers.clear();
    if (this.bot) {
      try { this.bot.end('Shutdown'); } catch (_) {}
      this.bot = null;
    }
    this.state.status = 'stopped';
  }

  connect() {
    if (this.stopping) return;
    this.cleanupConnection();
    this.state.status = 'connecting';

    const { bot, server, reconnect } = this.config;
    logger.info('Connecting to Minecraft server', { host: server.host, port: server.port });

    this.bot = mineflayer.createBot({
      username: bot.username,
      password: bot.password,
      auth: bot.auth,
      host: server.host,
      port: server.port,
      version: server.version,
      checkTimeoutInterval: 30000
    });

    const connectionTimeout = setTimeout(() => {
      if (this.state.status === 'connecting') {
        logger.warn('Connection timeout');
        try { this.bot.end('Connection timeout'); } catch (_) {}
      }
    }, reconnect.connectionTimeoutMs);

    this.bot.once('spawn', () => {
      clearTimeout(connectionTimeout);
      this.state.status = 'connected';
      this.state.connectedAt = Date.now();
      this.state.reconnectAttempts = 0;
      this.state.lastError = null;
      logger.info('Bot connected', { version: this.bot.version });
      this.registerModules();
    });

    this.bot.on('kicked', reason => {
      this.state.lastDisconnectReason = typeof reason === 'string' ? reason : JSON.stringify(reason);
      logger.warn('Bot kicked', { reason: this.state.lastDisconnectReason });
    });

    this.bot.on('error', error => {
      this.state.lastError = error.message;
      logger.error('Mineflayer error', { error: error.message });
    });

    this.bot.on('end', reason => {
      clearTimeout(connectionTimeout);
      this.state.status = 'disconnected';
      this.state.lastDisconnectReason = reason || 'connection closed';
      this.timers.clear();
      logger.warn('Bot disconnected', { reason: this.state.lastDisconnectReason });
      this.scheduleReconnect();
    });
  }

  registerModules() {
    registerAntiAfk(this.bot, this.config, this.timers);
    registerMovement(this.bot, this.config, this.timers);

    if (this.config.auth.enabled) this.registerAuth();
    if (this.config.chat.enabled) this.registerChat();
  }

  registerAuth() {
    let handled = false;
    const password = this.config.auth.password;
    const handle = type => {
      if (handled || !password || !this.bot) return;
      handled = true;
      this.bot.chat(type === 'register' ? `/register ${password} ${password}` : `/login ${password}`);
      logger.info('Authentication command sent', { type });
    };

    this.bot.on('messagestr', message => {
      const text = message.toLowerCase();
      if (text.includes('/register') || text.includes('register ')) handle('register');
      else if (text.includes('/login') || text.includes('login ')) handle('login');
    });
  }

  registerChat() {
    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return;
      logger.info('Minecraft chat', { username, message });
    });

    if (this.config.chat.messages.length) {
      let index = 0;
      this.timers.setInterval(() => {
        if (this.bot && this.state.status === 'connected') {
          this.bot.chat(this.config.chat.messages[index]);
          index = (index + 1) % this.config.chat.messages.length;
        }
      }, this.config.chat.intervalMs);
    }
  }

  scheduleReconnect() {
    if (this.stopping || !this.config.reconnect.enabled || this.reconnectTimer) return;
    const { baseDelayMs, maxDelayMs } = this.config.reconnect;
    this.state.reconnectAttempts += 1;
    const exponential = Math.min(baseDelayMs * (2 ** (this.state.reconnectAttempts - 1)), maxDelayMs);
    const jitter = Math.floor(Math.random() * 1000);
    const delay = exponential + jitter;
    logger.info('Scheduling reconnect', { attempt: this.state.reconnectAttempts, delayMs: delay });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  cleanupConnection() {
    this.timers.clear();
    if (!this.bot) return;
    try { this.bot.removeAllListeners(); this.bot.end(); } catch (_) {}
    this.bot = null;
  }

  getBot() { return this.bot; }
}

module.exports = { MinecraftBot };
