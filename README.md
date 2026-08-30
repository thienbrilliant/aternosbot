# Minecraft AFK Bot 🤖

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Mineflayer](https://img.shields.io/badge/Mineflayer-4.x-8B5CF6)](https://github.com/PrismarineJS/mineflayer)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A lightweight, production-oriented Minecraft AFK bot powered by [Mineflayer](https://github.com/PrismarineJS/mineflayer).

It connects to a Minecraft server, performs configurable anti-AFK activity, reconnects after transient disconnects, and exposes a small HTTP API for monitoring.

> **Provider-agnostic:** this project does not depend on Aternos, Render, or any specific hosting platform.

## ✨ Features

- 🔌 Automatic reconnect with exponential backoff and jitter
- 🕹️ Configurable anti-AFK behavior
- 🚶 Optional circle walking, looking around, and jumping
- 🔐 Optional `/login` and `/register` automation
- 💬 Optional scheduled chat messages
- ❤️ `/health` and `/ready` endpoints for monitoring
- 🔒 Credentials loaded from environment variables instead of committed config files
- 🧩 Modular runtime with separated responsibilities
- 🧹 Managed timers and graceful shutdown

## 📋 Requirements

- Node.js **20 or newer**
- A Minecraft server reachable from the machine running the bot
- A Minecraft account compatible with the server's authentication mode

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/thienbrilliant/minecraft-afk-bot.git
cd minecraft-afk-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy the example configuration:

```bash
cp .env.example .env
```

Then edit `.env` with your server details.

Example:

```env
MC_USERNAME=my_bot
MC_AUTH=offline
MC_HOST=play.example.net
MC_PORT=25565
MC_VERSION=
```

### 4. Start the bot

```bash
npm start
```

The bot will connect to the configured Minecraft server and start its enabled features.

### 5. Check the installation

You can validate the source without connecting to Minecraft:

```bash
npm test
```

## ⚙️ Configuration

All runtime configuration is stored in environment variables. The complete list is available in [`.env.example`](.env.example).

### Minecraft connection

| Variable | Description | Default |
|---|---|---|
| `MC_USERNAME` | Bot username | **required** |
| `MC_PASSWORD` | Account password when required | empty |
| `MC_AUTH` | Mineflayer authentication mode | `offline` |
| `MC_HOST` | Minecraft hostname or IP | **required** |
| `MC_PORT` | Minecraft server port | `25565` |
| `MC_VERSION` | Explicit Minecraft version | auto-detect |

### Reconnection

| Variable | Description | Default |
|---|---|---|
| `AUTO_RECONNECT` | Reconnect after disconnects | `true` |
| `RECONNECT_BASE_DELAY_MS` | Initial reconnect delay | `3000` |
| `RECONNECT_MAX_DELAY_MS` | Maximum reconnect delay | `120000` |
| `CONNECTION_TIMEOUT_MS` | Connection timeout | `120000` |

### Anti-AFK and movement

| Variable | Description | Default |
|---|---|---|
| `ANTI_AFK_ENABLED` | Enable anti-AFK behavior | `true` |
| `ANTI_AFK_SNEAK` | Keep sneak enabled | `false` |
| `MOVEMENT_ENABLED` | Enable movement features | `true` |
| `CIRCLE_WALK_ENABLED` | Enable circle walking | `true` |
| `CIRCLE_WALK_RADIUS` | Circle radius in blocks | `4` |
| `LOOK_AROUND_ENABLED` | Randomly change view direction | `true` |
| `RANDOM_JUMP_ENABLED` | Random jumping | `false` |

### Optional server authentication

For servers that use a `/login` or `/register` plugin:

```env
AUTO_AUTH_ENABLED=true
AUTO_AUTH_PASSWORD=your_secret_here
```

Keep the password in `.env` and **never commit it to Git**.

### Optional chat automation

```env
CHAT_ENABLED=true
CHAT_MESSAGES=hello everyone,I'm still here
CHAT_INTERVAL_MS=120000
```

### Monitoring API

```env
WEB_ENABLED=true
WEB_HOST=0.0.0.0
PORT=3000
```

## 🌐 Monitoring

When the monitoring server is enabled:

### Dashboard

```text
GET /
```

Simple browser dashboard showing the bot status and basic runtime information.

### Health

```text
GET /health
```

Returns JSON with runtime status, uptime, reconnect information, memory usage, and bot position when available.

Example:

```bash
curl http://localhost:3000/health
```

### Readiness

```text
GET /ready
```

Returns HTTP `200` when the bot is connected and ready; otherwise it reports that the bot is not ready.

## 🖥️ Running as a background process

For a local machine or VPS, use a process manager such as `systemd`, `pm2`, Docker, or another supervisor appropriate for your environment.

The application itself does not require a special hosting provider or keep-alive/self-ping mechanism.

## 🐳 Docker

Docker support can be added on top of the standard Node.js runtime. The application only needs the same environment variables described in `.env.example`.

## 🧑‍💻 Development

Useful commands:

```bash
npm install      # install dependencies
npm start        # start the bot
npm test         # run source validation
npm run check    # run syntax checks
```

Project layout:

```text
minecraft-afk-bot/
├── index.js
├── .env.example
├── package.json
├── README.md
└── src/
    ├── index.js
    ├── config.js
    ├── bot.js
    ├── state.js
    ├── timers.js
    ├── logger.js
    ├── web.js
    └── modules/
        ├── antiAfk.js
        └── movement.js
```

## 🔐 Security

Do not commit:

```text
.env

```

or any real Minecraft, webhook, or server credentials.

If credentials were previously committed to a public repository, rotate them even after removing the file from the latest commit because old Git history may still contain them.

## ⚠️ Disclaimer

This project is not affiliated with Mojang or Microsoft.

Automated clients and AFK behavior may be restricted by individual servers. Use this bot only where you have permission to do so and follow the server's rules and applicable terms of service.

## 📦 Release

Current version: **v3.0.0**

See the [GitHub Releases](https://github.com/thienbrilliant/minecraft-afk-bot/releases) page for release notes and future versions.

## 📄 License

MIT
