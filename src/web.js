'use strict';

const express = require('express');
const { snapshot } = require('./state');
const logger = require('./logger');

function createWebServer(config, state, getBot) {
  if (!config.web.enabled) return null;

  const app = express();
  app.disable('x-powered-by');

  app.get('/health', (_req, res) => {
    const data = snapshot(state, getBot());
    const healthy = data.status === 'connected';
    res.status(healthy ? 200 : 503).json({ ...data, healthy });
  });

  app.get('/ready', (_req, res) => {
    res.status(state.status === 'connected' ? 200 : 503).json({ ready: state.status === 'connected' });
  });

  app.get('/', (_req, res) => {
    res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Minecraft AFK Bot</title><style>body{font-family:system-ui;background:#0b1020;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0}.card{width:min(560px,90vw);padding:32px;border:1px solid #263044;border-radius:18px;background:#111827}h1{margin-top:0}.status{font-size:1.4rem}</style></head><body><main class="card"><h1>🤖 Minecraft AFK Bot</h1><p class="status" id="status">Loading…</p><pre id="details"></pre><script>async function refresh(){try{const r=await fetch('/health');const d=await r.json();document.querySelector('#status').textContent=d.healthy?'● Connected':'○ '+d.status;document.querySelector('#details').textContent=JSON.stringify(d,null,2)}catch(e){document.querySelector('#status').textContent='○ Monitoring unavailable'}}refresh();setInterval(refresh,5000)</script></main></body></html>`);
  });

  const server = app.listen(config.web.port, config.web.host, () => {
    logger.info('HTTP monitoring server started', { host: config.web.host, port: config.web.port });
  });

  return server;
}

module.exports = { createWebServer };
