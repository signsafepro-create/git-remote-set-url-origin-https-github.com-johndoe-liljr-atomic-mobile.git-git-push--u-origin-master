# Lil Jr Phone Setup Guide

## 1. Backend (Server)
- Run `uvicorn server:app --reload` on your phone or local server.
- Make sure `SUPER_AUTONOMY=true` is set in your `.env` file.
- Open firewall/port 8000 for local network access.

## 2. Frontend (App)
- Edit `src/config/api.js` and set `API_BASE_URL` to your phone/server IP, e.g.:
  `export const API_BASE_URL = 'http://192.168.1.100:8000';`
- Or set `LILJR_API_URL` in your environment/config.

## 3. Connect
- Open the app on your phone.
- Lil Jr will now talk directly to your backend—no cloud, no platform lock-in.

## 4. Plugins & Knowledge
- Add plugins to the `plugins/` folder.
- Use `/api/super_autonomy/*` endpoints for automation, learning, and more.

## 5. Security
- Only share your backend IP with trusted devices.
- Use strong passwords and consider HTTPS for remote access.

---
You are now fully in control. Lil Jr is your all-in-one, self-hosted automation and intelligence hub!