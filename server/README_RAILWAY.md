# Lil Jr 2.0 FastAPI Backend

## How to deploy on Railway

1. Go to https://railway.app and create a new project.
2. Upload `server.py` and `requirements.txt` from the `server/` folder.
3. Set the start command to:
   
   python server.py

4. Set the port to 8000 (or 8001 if you want to keep your current config).
5. Click Deploy. Railway will give you a public URL.

## Files to upload
- server.py
- requirements.txt

## Environment variables
If you use any API keys (like GROQ_API_KEY), add them in the Railway dashboard under Variables.
