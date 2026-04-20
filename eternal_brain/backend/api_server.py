"""
API SERVER - WebSocket and HTTP interface to the eternal brain
Frontend connects here to see and command the living system
"""

import asyncio
import json
from typing import Dict, Any, Set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

from .river_brain import RiverBrain

from .nl2code import NL2Code

class EternalAPIServer:
    """Serves the eternal brain to frontend."""

    def __init__(self, brain: RiverBrain, static_path: str = "../frontend"):
        self.brain = brain
        self.app = FastAPI(title="Eternal Brain API")
        self.static_path = static_path
        self.connections: Set[WebSocket] = set()
        self._loop = None  # Will be set in run()

        # Setup routes
        self._setup_routes()

        # Connect brain callbacks to WebSocket
        self.brain.on_pulse = self._broadcast_pulse
        self.brain.on_birth = self._broadcast_birth
        self.brain.on_death = self._broadcast_death

    def _setup_routes(self):
        nl2code_engine = NL2Code()
        error_monitor = self.brain.bloodstream.cells[next(iter(self.brain.bloodstream.cells))].error_monitor if self.brain.bloodstream.cells else None

        @self.app.post("/api/voice-command")
        async def voice_command_endpoint(request: Dict[str, Any]):
            # Accepts: { command: str, source: str, timestamp: int }
            command = request.get("command")
            source = request.get("source", "unknown")
            timestamp = request.get("timestamp")
            # Log or process the command (for now, just print and store in brain)
            if not hasattr(self.brain, "voice_commands"):
                self.brain.voice_commands = []
            self.brain.voice_commands.append({
                "command": command,
                "source": source,
                "timestamp": timestamp
            })
            print(f"[VOICE COMMAND] {source}: {command} @ {timestamp}")
            return {"status": "received", "command": command, "source": source, "timestamp": timestamp}

        @self.app.get("/api/planner/active")
        async def planner_active():
            return self.brain.planner.get_active_plans()

        @self.app.get("/api/planner/history")
        async def planner_history():
            return self.brain.planner.get_history()

        @self.app.post("/api/nl2code")
        async def nl2code_endpoint(request: Dict[str, Any]):
            instruction = request.get("instruction")
            cell_name = request.get("cell_name", "nl2cell")
            if not instruction:
                return {"error": "No instruction provided."}
            code = nl2code_engine.generate_code(instruction)
            cell = self.brain.seed_archetype(cell_name, code)
            return {"cell": cell.to_dict(), "code": code}

        @self.app.get("/", response_class=HTMLResponse)
        async def root():
            try:
                with open(f"{self.static_path}/index.html") as f:
                    return f.read()
            except:
                return "<h1>Eternal Brain Running</h1><p>Frontend not found</p>"

        @self.app.get("/api/status")
        async def status():
            return self.brain.get_status()

        @self.app.get("/api/errors")
        async def errors():
            # Return the latest error log (self-healing, wisdom, rollbacks)
            if not self.brain.bloodstream.cells:
                return []
            # Use any cell's error_monitor (shared)
            error_monitor = next(iter(self.brain.bloodstream.cells.values())).error_monitor
            return error_monitor.get_error_log(50)

        @self.app.get("/api/lineage/{cell_id}")
        async def lineage(cell_id: str):
            # Return ancestry and descendants for a cell
            lineage = self.brain.bloodstream.cell_lineages.get(cell_id, [])
            return {"cell_id": cell_id, "lineage": lineage}

        @self.app.get("/api/health")
        async def health():
            # Simple backend health check
            return {"status": "ok", "pulse_count": self.brain.pulse_count, "living": len(self.brain.bloodstream.cells)}

        @self.app.post("/api/invoke/{cell_name}")
        async def invoke(cell_name: str, args: list = []):
            return self.brain.invoke(cell_name, *args)

        @self.app.post("/api/bpm/{new_bpm}")
        async def set_bpm(new_bpm: float):
            self.brain.set_bpm(new_bpm)
            return {'bpm': self.brain.bpm}

        @self.app.post("/api/evolve/{cell_id}")
        async def evolve(cell_id: str, code: str):
            return self.brain.force_evolve(cell_id, code)

        @self.app.websocket("/ws")
        async def websocket(ws: WebSocket):
            await ws.accept()
            self.connections.add(ws)

            # Send initial state
            await ws.send_json({
                'type': 'init',
                'data': self.brain.get_status()
            })

            try:
                while True:
                    msg = await ws.receive_text()
                    cmd = json.loads(msg)

                    if cmd.get('action') == 'invoke':
                        result = self.brain.invoke(
                            cmd['cell'],
                            *cmd.get('args', [])
                        )
                        await ws.send_json({
                            'type': 'invocation_result',
                            'data': result
                        })

                    elif cmd.get('action') == 'set_bpm':
                        self.brain.set_bpm(cmd['bpm'])

                    elif cmd.get('action') == 'seed':
                        cell = self.brain.seed_archetype(
                            cmd['name'],
                            cmd['code']
                        )
                        await ws.send_json({
                            'type': 'seeded',
                            'data': cell.to_dict()
                        })

            except WebSocketDisconnect:
                self.connections.discard(ws)

    # Broadcast error/wisdom events to frontend (to be called from error_monitor or cell logic)
    def broadcast_error_event(self, event: Dict[str, Any]):
        if self._loop:
            asyncio.run_coroutine_threadsafe(self._send_to_all({
                'type': 'error_event',
                'data': event
            }), self._loop)
    
    def _broadcast_pulse(self, data: Dict[str, Any]):
        """Send heartbeat to all connected frontends."""
        if self._loop:
            asyncio.run_coroutine_threadsafe(self._send_to_all({
                'type': 'pulse',
                'data': data
            }), self._loop)

    def _broadcast_birth(self, cell: Dict[str, Any]):
        """Announce new life."""
        if self._loop:
            asyncio.run_coroutine_threadsafe(self._send_to_all({
                'type': 'birth',
                'data': cell
            }), self._loop)

    def _broadcast_death(self, count: int):
        """Announce return to river."""
        if self._loop:
            asyncio.run_coroutine_threadsafe(self._send_to_all({
                'type': 'death',
                'data': {'count': count}
            }), self._loop)
    
    async def _send_to_all(self, message: Dict[str, Any]):
        """Broadcast to all connections."""
        dead = set()
        for ws in self.connections:
            try:
                await ws.send_json(message)
            except:
                dead.add(ws)
        
        # Clean dead connections
        self.connections -= dead
    
    def run(self, host: str = "0.0.0.0", port: int = 7777):
        """Start serving."""
        try:
            self._loop = asyncio.get_event_loop()
        except RuntimeError:
            self._loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self._loop)
        uvicorn.run(self.app, host=host, port=port)
