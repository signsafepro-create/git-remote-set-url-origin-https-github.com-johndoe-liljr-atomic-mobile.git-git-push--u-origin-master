import os
import time
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from typing import Optional

app = FastAPI()

COMMAND_FILE = "command_queue.json"
RESULT_FILE = "command_result.json"

@app.post("/api/queue_command")
async def queue_command(request: Request):
    data = await request.json()
    command = data.get("command")
    if not command:
        return JSONResponse({"error": "No command provided"}, status_code=400)
    # Save command to file
    with open(COMMAND_FILE, "w") as f:
        json.dump({"command": command}, f)
    return {"status": "queued", "command": command}

@app.get("/api/get_command")
def get_command():
    if os.path.exists(COMMAND_FILE):
        with open(COMMAND_FILE) as f:
            cmd = json.load(f)
        os.remove(COMMAND_FILE)
        return cmd
    return {"command": None}

@app.post("/api/command_result")
async def command_result(request: Request):
    data = await request.json()
    result = data.get("result")
    with open(RESULT_FILE, "w") as f:
        json.dump({"result": result}, f)
    return {"status": "received"}

@app.get("/api/get_result")
def get_result():
    if os.path.exists(RESULT_FILE):
        with open(RESULT_FILE) as f:
            res = json.load(f)
        os.remove(RESULT_FILE)
        return res
    return {"result": None}
