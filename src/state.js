'use strict';

function createState() {
  return {
    status: 'starting',
    startedAt: Date.now(),
    connectedAt: null,
    reconnectAttempts: 0,
    lastError: null,
    lastDisconnectReason: null,
    position: null
  };
}

function snapshot(state, bot) {
  return {
    status: state.status,
    uptimeSeconds: Math.floor((Date.now() - state.startedAt) / 1000),
    connectedAt: state.connectedAt,
    reconnectAttempts: state.reconnectAttempts,
    lastError: state.lastError,
    lastDisconnectReason: state.lastDisconnectReason,
    position: bot?.entity?.position ? {
      x: Math.floor(bot.entity.position.x),
      y: Math.floor(bot.entity.position.y),
      z: Math.floor(bot.entity.position.z)
    } : null,
    memoryMb: Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1))
  };
}

module.exports = { createState, snapshot };
