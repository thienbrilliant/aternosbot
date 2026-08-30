# Minecraft AFK Bot 🤖

A lightweight, production-oriented Minecraft AFK bot built with [Mineflayer](https://github.com/PrismarineJS/mineflayer). It connects to a Minecraft server, performs configurable anti-AFK activity, reconnects after transient disconnects, and exposes a small health API for monitoring.

> This project is provider-agnostic. It does **not** depend on Aternos, Render, or any specific hosting platform.

## Features

- 🔌 Automatic reconnect with exponential backoff + jitter
- 🕹️ Configurable anti-AFK behavior
- 🚶 Optional circle movement, looking around, and jumping
- 🔐 Optional server `/login` / `/register` automation
- 💬 Optional scheduled chat messages
- ❤️ `/health` and `/ready` monitoring endpoints
- 🔒 Credentials are supplied through environment variables, never committed to Git
- 🧩 Small modules with a single responsibility
- 🧹 Managed timers and graceful shutdown

## Requirements

- Node.js 20+
- A Minecraft server reachable from the machine running the bot
- A Minecraft account appropriate for the server's authentication mode

## Setup

```bash
git clone https://github.com/thienbrilliant/minecraft-afk-bot.git
cd minecraft-afk-bot
npm install
cp .env.example .env
```

Edit `.env`:

```env
MC_USERNAME=my_bot
MC_AUTH=offline
MC_HOST=play.example.net
MC_PORT=25565
MC_VERSION=
```

Then start:

```bash
npm start
```

Validate the source without starting the bot:

```bash
npm test
```

## Configuration

All runtime configuration lives in environment variables. See `.env.example` for the complete list.

Important variables:

| Variable | Purpose | Default |
|---|---|---|
| `MC_USERNAME` | Bot username | required |
| `MC_PASSWORD` | Minecraft account password when required | empty |
| `MC_AUTH` | Mineflayer auth mode | `offline` |
| `MC_HOST` | Minecraft hostname/IP | required |
| `MC_PORT` | Minecraft port | `25565` |
| `MC_VERSION` | Explicit protocol version | auto-detect |
| `AUTO_RECONNECT` | Reconnect after disconnects | `true` |
| `ANTI_AFK_ENABLED` | Enable anti-AFK activity | `true` |
| `CIRCLE_WALK_ENABLED` | Enable movement | `true` |
| `WEB_ENABLED` | Enable monitoring API | `true` |
| `PORT` | Monitoring API port | `3000` |

### Server authentication plugin

If the server uses a `/login` or `/register` plugin, enable it explicitly:

```env
AUTO_AUTH_ENABLED=true
AUTO_AUTH_PASSWORD=use_a_secret_here
```

Do not commit `.env` or any real credentials.

## Monitoring

When the web server is enabled:

- `GET /` — minimal status dashboard
- `GET /health` — detailed JSON health information
- `GET /ready` — readiness probe (`200` when connected)

Example:

```bash
curl http://localhost:3000/health
```

## Architecture

```text
index.js
└── src/
    ├── index.js       # application lifecycle
    ├── config.js      # environment validation
    ├── bot.js         # Mineflayer lifecycle + reconnect
    ├── state.js       # runtime state
    ├── timers.js      # timer ownership/cleanup
    ├── logger.js      # structured console logging
    ├── web.js         # monitoring HTTP API
    └── modules/
        ├── antiAfk.js
        └── movement.js
```

The bot runtime is intentionally independent from the monitoring server. Hosting providers can therefore run the process however they want; no provider-specific keep-alive or self-ping mechanism is required.

## Disclaimer

This project is not affiliated with Mojang or Microsoft. Server owners may restrict automated clients or AFK behavior. Use the bot only where you have permission to do so and follow the server's rules and applicable terms of service.

## License

MIT
