liljr-backend/
├── .env                  # Environment variables (see below)
├── node_modules/         # Node dependencies
├── package.json          # Dependencies & scripts
├── package-lock.json     # Lockfile
└── server.js             # Main Express server (API)
GROQ_API_KEY=your_groq_key
ARCHITECT_SECRET=your_secret
DATABASE_URL=your_postgres_url
PORT=3000
# Install dependencies
cd liljr-backend
npm install
# Start server (local)
node server.js
# For Railway deploy: push to GitHub, connect Railway, set env vars, deploy.
# LIL JR 2.0 — BACKEND HANDOFF PACKAGE

## 📂 Folder Structure
```
liljr-backend/
├── .env                  # Environment variables (see below)
├── node_modules/         # Node dependencies
├── package.json          # Dependencies & scripts
├── package-lock.json     # Lockfile
└── server.js             # Main Express server (API)
```

## 🔑 Environment Variables (.env example)
```env
GROQ_API_KEY=your_groq_key
DATABASE_URL=your_postgres_url
PORT=3000
```
*No Stripe key needed for personal build.*
*Use Railway internal DB URL for deploy, public DB URL for local dev.*

## 📦 Key Dependencies
- express
- cors
- dotenv
- pg
- groq-sdk

## 🛠️ Build & Run
```sh
# Install dependencies
cd liljr-backend
npm install

# Start server (local)
node server.js

# For Railway deploy:
# 1. Push to GitHub
# 2. Connect Railway project
# 3. Set environment variables
# 4. Deploy
```

## 🌐 API Endpoints
| Endpoint                | Method | Description                                 |
|------------------------|--------|---------------------------------------------|
| /flow/touch            | POST   | Main chat/interaction endpoint              |
| /flow/dreaming         | GET    | Admin stats (requires ARCHITECT_SECRET)     |
| /architect/add-thing   | POST   | Add inventory item (admin, protected)       |
| /architect/add-helper  | POST   | Add helper/service (admin, protected)       |
| /teach                 | POST   | AI tutor (Groq)                             |
| /health                | GET    | Health check                                |
| /mobile-scan           | POST   | Demo scan endpoint (for mobile)             |


## 🧩 Integration Points
- Frontend calls `/flow/touch` for chat/AI.
- `/health` for health check.
- Admin endpoints require `x-architect-key` header with `ARCHITECT_SECRET`.
*No payment endpoints (Stripe) in personal build.*

## ⚠️ Special Notes
- Database tables auto-create on startup (PostgreSQL required).
- All secrets must be set in Railway for deploy.
- No payment/tier logic in this build.

---

**Ready for handoff!**

This backend is perfectly aligned with the frontend handoff structure and is fully cleaned for personal use. For any new agent: see this file, the .env, and server.js for everything you need.
