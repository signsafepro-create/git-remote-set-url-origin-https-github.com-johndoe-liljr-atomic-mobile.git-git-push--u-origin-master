# server.py
# Main backend for Lil Jr 2.0 Operator App

from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException, WebSocket
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import io
import uvicorn
import requests

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow CORS for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy in-memory data for demonstration
brain_stats = {
    "learning": [],
    "fixes": [],
    "marketing": [],
    "live_feed": []
}

# Health check
@app.get("/api/")
def health():
    return {"status": "ok"}


# AI chat endpoint (realistic mode)
@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    realistic = user_message.strip().startswith('[REALISTIC]')
    prompt = user_message.replace('[REALISTIC]', '').strip() if realistic else user_message

    if realistic:
        # Use Groq API for realistic, human-like responses
        groq_key = os.getenv('GROQ_API_KEY', '')
        if not groq_key:
            return {"response": "[Realistic mode unavailable: GROQ_API_KEY not set]"}
        try:
            groq_response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4.0-turbo",  # or your preferred model
                    "messages": [
                        {"role": "system", "content": "You are Lil Jr, a witty, friendly, and deeply human conversationalist. Respond naturally and empathetically."},
                        {"role": "user", "content": prompt}
                    ]
                },
                timeout=10
            )
            groq_data = groq_response.json()
            reply = groq_data.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
            return {"response": reply or "[No response from Groq AI]"}
        except Exception as e:
            return {"response": f"[Realistic mode error: {str(e)}]"}
    else:
        # Default mock response
        return {"response": f"Lil Jr says: You said '{prompt}'"}

# Voice-to-text (mock)
@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # TODO: Integrate Whisper STT
    return {"transcript": "(transcribed text)"}

# Admin voice authentication (mock)
@app.post("/api/voice-auth")
async def voice_auth(phrase: str = Form(...)):
    admin_phrase = os.getenv("ADMIN_VOICE_PHRASE", "")
    # TODO: Add fuzzy matching
    if phrase.strip().lower() == admin_phrase.strip().lower():
        return {"auth": True}
    return {"auth": False}

# Owner unlock endpoint (passphrase or voice)
from fastapi import Response
import secrets
import time
OWNER_SESSIONS = {}

@app.post("/api/owner-unlock")
async def owner_unlock(request: Request):
    """
    Unlocks owner (God mode) with passphrase or voice. Returns a session token.
    Set OWNER_PASSPHRASE in .env for passphrase unlock.
    """
    data = await request.json()
    passphrase = data.get("passphrase", "")
    voice = data.get("voice", "")
    owner_pass = os.getenv("OWNER_PASSPHRASE", "")
    admin_phrase = os.getenv("ADMIN_VOICE_PHRASE", "")
    if (owner_pass and passphrase.strip() == owner_pass.strip()) or (admin_phrase and voice.strip().lower() == admin_phrase.strip().lower()):
        # Generate session token
        token = secrets.token_urlsafe(32)
        OWNER_SESSIONS[token] = int(time.time())
        return {"unlocked": True, "token": token}
    return {"unlocked": False}

@app.post("/api/owner-verify")
async def owner_verify(request: Request):
    """
    Verifies owner session token for God mode access.
    """
    data = await request.json()
    token = data.get("token", "")
    # Session valid for 24h
    now = int(time.time())
    if token in OWNER_SESSIONS and now - OWNER_SESSIONS[token] < 86400:
        return {"valid": True}
    return {"valid": False}

# Pricing tiers (mock)
@app.get("/api/pricing")
def pricing():
    return {"tiers": ["Free", "Student", "Pro", "Enterprise", "Custom"]}



# Public brain stats (mock)
@app.get("/api/stats")
def stats():
    # Add additional fields as requested
    return {
        "stats": brain_stats,
        "domains": 5,
        "totalKnowledge": "operational"
    }

# Admin dashboard stats (mock)
@app.get("/api/admin/stats")
def admin_stats():
    return {"admin_stats": brain_stats}

# Live admin data feed (mock)
@app.get("/api/admin/live-feed")
def live_feed():
    return StreamingResponse(io.StringIO("Live data stream..."), media_type="text/plain")

# Ultra-open: Open-source model chat endpoint
@app.post("/api/openchat")
async def openchat(request: Request):
    """
    Forwards chat to a self-hosted open-source model (e.g., llama.cpp, vLLM, etc.).
    Set OPENCHAT_API_URL in your .env to the model's API endpoint (e.g., http://localhost:8002/v1/chat/completions)
    """
    data = await request.json()
    user_message = data.get("message", "")
    history = data.get("history", [])
    openchat_url = os.getenv("OPENCHAT_API_URL", "http://localhost:8002/v1/chat/completions")
    try:
        payload = {
            "model": os.getenv("OPENCHAT_MODEL", "llama-2-7b-chat"),
            "messages": history + [{"role": "user", "content": user_message}],
            "temperature": data.get("temperature", 0.7),
            "max_tokens": data.get("max_tokens", 512)
        }
        resp = requests.post(openchat_url, json=payload, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        reply = result.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        return {"response": reply or "[No response from open model]"}
    except Exception as e:
        return {"response": f"[Open model error: {str(e)}]"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
