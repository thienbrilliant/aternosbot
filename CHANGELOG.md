# Changelog

All notable changes to this project are documented here.

## [3.0.0] - 2026-08-30

### 🚀 Added

- Production-oriented modular runtime
- Automatic reconnect with exponential backoff and jitter
- Configurable anti-AFK and movement features
- Optional `/login` and `/register` automation
- Optional scheduled chat automation
- `/health` and `/ready` monitoring endpoints
- Graceful shutdown and managed timer cleanup
- Environment-based runtime configuration

### 🔒 Security

- Removed tracked runtime credentials and server-specific settings
- Secrets are now provided through environment variables
- Added `.env.example` as a safe configuration template

### 🧹 Removed

- Aternos-specific runtime logic
- Render/self-ping keep-alive logic
- Provider-specific hosting assumptions
- Unused pathfinder dependency
- Legacy launcher account state

### 📚 Documentation

- Rewritten README
- Added installation and configuration instructions
- Added monitoring and development documentation
- Added security guidance

[3.0.0]: https://github.com/thienbrilliant/minecraft-afk-bot/releases/tag/v3.0.0
