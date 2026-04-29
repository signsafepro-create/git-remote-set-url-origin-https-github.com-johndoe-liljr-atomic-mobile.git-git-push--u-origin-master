
from fastapi import Body, FastAPI, Request, UploadFile, File, Form, HTTPException, WebSocket
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from typing import Optional
import io
import uvicorn
import requests
from fastapi import APIRouter
import subprocess
import json
from datetime import datetime
from fastapi.staticfiles import StaticFiles


# Load environment variables
load_dotenv()

# --- SUPER AUTONOMY MODE ---
SUPER_AUTONOMY = os.getenv("SUPER_AUTONOMY", "false").lower() == "true"

# Local knowledge base file
KNOWLEDGE_BASE_FILE = "liljr_knowledge_base.jsonl"

def save_to_knowledge_base(entry: dict):
    with open(KNOWLEDGE_BASE_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

# Plugin/extension loader (scaffold)
PLUGINS_DIR = "plugins"
if not os.path.exists(PLUGINS_DIR):
    os.makedirs(PLUGINS_DIR)

def load_plugins():
    plugins = []
    for fname in os.listdir(PLUGINS_DIR):
        if fname.endswith(".py"):
            try:
                import importlib.util
                spec = importlib.util.spec_from_file_location(fname[:-3], os.path.join(PLUGINS_DIR, fname))
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                plugins.append(mod)
            except Exception as e:
                print(f"Failed to load plugin {fname}: {e}")
    return plugins

PLUGINS = load_plugins()

# Persistent memory file
MEMORY_FILE = "liljr_memory.jsonl"
KNOWLEDGE_FILE = "liljr_knowledge.json"


# Import and include the GitHub bridge router
from src.api import github_bridge


app = FastAPI()
app.include_router(github_bridge.router)

# --- SUPER AUTONOMY ENDPOINTS ---
@app.post("/api/super_autonomy/build_deploy")
async def build_and_deploy(request: Request):
    if not SUPER_AUTONOMY:
        return {"error": "Super autonomy mode is not enabled."}
    data = await request.json()
    # Example: run build/deploy scripts (customize as needed)
    try:
        result = subprocess.run(["sh", "genesis.sh"], capture_output=True, text=True)
        save_to_knowledge_base({"action": "build_deploy", "output": result.stdout, "error": result.stderr})
        return {"status": "ok", "output": result.stdout, "error": result.stderr}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/api/super_autonomy/learn")
async def learn_knowledge(request: Request):
    if not SUPER_AUTONOMY:
        return {"error": "Super autonomy mode is not enabled."}
    data = await request.json()
    entry = data.get("entry", {})
    save_to_knowledge_base(entry)
    return {"status": "ok"}

@app.get("/api/super_autonomy/plugins")
async def list_plugins():
    if not SUPER_AUTONOMY:
        return {"error": "Super autonomy mode is not enabled."}
    return {"plugins": [p.__name__ for p in PLUGINS]}

@app.post("/api/super_autonomy/run_plugin")
async def run_plugin(request: Request):
    if not SUPER_AUTONOMY:
        return {"error": "Super autonomy mode is not enabled."}
    data = await request.json()
    plugin_name = data.get("plugin")
    args = data.get("args", {})
    for p in PLUGINS:
        if p.__name__ == plugin_name and hasattr(p, "run"):
            try:
                result = p.run(**args)
                save_to_knowledge_base({"action": "run_plugin", "plugin": plugin_name, "result": result})
                return {"status": "ok", "result": result}
            except Exception as e:
                return {"status": "error", "error": str(e)}
    return {"error": "Plugin not found or missing 'run' method."}

# --- Live Terminal File API ---
@app.post("/api/read_file")
async def read_file(request: Request):
    data = await request.json()
    file = data.get("file", "live_code.py")
    try:
        with open(file, "r", encoding="utf-8") as f:
            lines = f.readlines()
        return {"lines": [l.rstrip('\n') for l in lines]}
    except Exception as e:
        return {"lines": [], "error": str(e)}

@app.post("/api/append_file")
async def append_file(request: Request):
    data = await request.json()
    file = data.get("file", "live_code.py")
    line = data.get("line", "")
    try:
        with open(file, "a", encoding="utf-8") as f:
            f.write(line + "\n")
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "error": str(e)}

# Serve static frontend (dist/) at root
frontend_dir = os.path.join(os.path.dirname(__file__), 'dist')
if os.path.exists(frontend_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, 'assets')), name="assets")
    app.mount("/_expo", StaticFiles(directory=os.path.join(frontend_dir, '_expo')), name="_expo")

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = os.path.join(frontend_dir, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h1>Frontend not found</h1>", status_code=404)

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

# Endpoint to write code to a file
@app.post("/api/write_code")
async def write_code(request: Request):
    data = await request.json()
    code = data.get("code", "")
    filename = data.get("filename", "generated_code.py")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(code)
    return {"status": "success", "filename": filename}



# --- Persistent Memory and Learning Loop ---
def log_interaction(user_message, response, context=None):
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "user_message": user_message,
        "response": response,
        "context": context or {}
    }
    with open(MEMORY_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

def update_knowledge(user_message, response):
    # Simple example: store Q&A pairs
    try:
        if os.path.exists(KNOWLEDGE_FILE):
            with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
                kb = json.load(f)
        else:
            kb = {}
        kb[user_message] = response
        with open(KNOWLEDGE_FILE, "w", encoding="utf-8") as f:
            json.dump(kb, f, ensure_ascii=False, indent=2)
    except Exception as e:
        pass  # Don't crash on knowledge update

# AI chat endpoint (realistic mode)
@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    realistic = user_message.strip().startswith('[REALISTIC]')
    prompt = user_message.replace('[REALISTIC]', '').strip() if realistic else user_message
    history = data.get("history", [])  # New: get conversation history

    # Build conversation context for the AI
    conversation = []
    if history and isinstance(history, list):
        for msg in history:
            if msg.get('role') in ('user', 'assistant') and msg.get('content'):
                conversation.append({"role": msg['role'], "content": msg['content']})
    # Always add the current user message as the last entry
    conversation.append({"role": "user", "content": prompt})

    if realistic:
        # Use Groq API for realistic, human-like responses
        groq_key = os.getenv('GROQ_API_KEY', '')
        if not groq_key:
            response = "[Realistic mode unavailable: GROQ_API_KEY not set]"
            log_interaction(user_message, response, {"history": history})
            update_knowledge(user_message, response)
            return {"response": response}
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
                        *conversation
                    ]
                },
                timeout=10
            )
            groq_data = groq_response.json()
            reply = groq_data.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
            log_interaction(user_message, reply, {"history": history})
            update_knowledge(user_message, reply)
            return {"response": reply or "[No response from Groq AI]"}
        except Exception as e:
            response = f"[Realistic mode error: {str(e)}]"
            log_interaction(user_message, response, {"history": history})
            update_knowledge(user_message, response)
            return {"response": response}
    else:
        # HARD FAIL: If not realistic mode, return error
        from fastapi import HTTPException
        response = "AI backend is not enabled. Set up Groq/OpenAI and use realistic mode."
        log_interaction(user_message, response, {"history": history})
        update_knowledge(user_message, response)
        raise HTTPException(status_code=501, detail=response)

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

# Pricing tiers (mock)
@app.get("/api/pricing")
def pricing():
    return {"tiers": ["Free", "Student", "Pro", "Enterprise", "Custom"]}

# --- Voice Command Device Control API ---
router = APIRouter()

@router.post("/api/voice-command")
async def handle_voice_command(request: Request):
    data = await request.json()
    command_text = data.get("command", "").lower()
    result = ""
    try:
        # Example: open app
        if "open" in command_text:
            app_name = command_text.split("open")[-1].strip()
            subprocess.run([app_name], check=True)
            result = f"Opened {app_name}"
        # Example: send SMS
        elif "sms" in command_text:
            # Integrate with SMS API or system here
            result = "SMS command received"
        # Example: make call
        elif "call" in command_text:
            # Integrate with phone/call API here
            result = "Call command received"
        else:
            result = f"Command received: {command_text}"
    except Exception as e:
        result = f"Error: {str(e)}"
    return {"result": result}

# Endpoint to run shell commands (with caution)
@app.post("/api/run_command")
async def run_command(request: Request):
    data = await request.json()
    command = data.get("command", "")
    try:
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, timeout=30, encoding="utf-8")
        return {"status": "success", "output": result}
    except subprocess.CalledProcessError as e:
        return {"status": "error", "output": e.output}
    except Exception as ex:
        return {"status": "error", "output": str(ex)}

app.include_router(router)

# Public brain stats (mock)
@app.get("/api/stats")
def public_stats():
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

## Removed __main__ block for uvicorn compatibility
