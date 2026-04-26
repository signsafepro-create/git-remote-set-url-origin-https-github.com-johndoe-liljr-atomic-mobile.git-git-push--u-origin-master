# Lil Jr Standalone App

## One-command Start

1. Install Python 3.8+
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Build your frontend (if not already built):
   ```sh
   # From your frontend folder
   npm install
   npm run build  # or expo export:web
   # Copy the build/dist output into the backend 'dist/' folder
   ```
4. Start the app:
   ```sh
   python server.py
   # or
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```
5. Visit http://localhost:8000 in your browser.

- The backend API is available at `/api/*`.
- The frontend is served at `/`.

## No Vercel, No Netlify, No Railway Needed
- Everything runs from Python.
- Deploy anywhere you can run Python (local, VPS, cloud, etc).

## Environment
- Set your keys in `.env` (see `.env.example`).

## To Deploy
- Copy the whole folder to your server.
- Run `python server.py`.
- Done!

---

**This is the all-in-one, production-ready, standalone Lil Jr app.**
