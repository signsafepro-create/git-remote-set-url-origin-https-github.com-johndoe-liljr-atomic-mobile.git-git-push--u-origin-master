#!/usr/bin/env python3
"""
LAUNCH ETERNAL BRAIN - Frontend + Backend together
"""

import sys
import os

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from backend.river_brain import RiverBrain
from backend.api_server import EternalAPIServer


def main():
    # Create the eternal brain
    brain = RiverBrain()
    
    # Seed initial eternal cell lines
    brain.seed_archetype('calculator', '''
def main(a=0, b=0, op='add'):
    if op == 'add': return a + b
    if op == 'mul': return a * b
    if op == 'div': return a / b if b != 0 else 'protected'
    return a + b
''')
    
    brain.seed_archetype('transformer', '''
def main(data=None):
    if isinstance(data, str):
        return data.upper() + " ✨"
    if isinstance(data, (int, float)):
        return data * 42
    return str(data)
''')
    
    brain.seed_archetype('guardian', '''
def main(threat=None):
    dangerous = ['delete', 'rm', 'drop', 'destroy']
    if threat and any(d in str(threat).lower() for d in dangerous):
        return {"blocked": True, "reason": "Learned danger pattern"}
    return {"allowed": True}
''')
    
    # Start API server (serves frontend too)
    server = EternalAPIServer(brain, static_path='frontend')
    # Awaken the brain (after server so event loop is set)
    brain.awaken()
    
    print("=" * 60)
    print("🌊 ETERNAL BRAIN ONLINE")
    print("=" * 60)
    print("Frontend: http://localhost:7777")
    print("API: http://localhost:7777/api/status")
    print("WebSocket: ws://localhost:7777/ws")
    print("=" * 60)
    print("Commands:")
    print("  invoke <cell> [args] - Execute eternal cell")
    print("  seed <name> <code> - Plant new cell line")
    print("  bpm <number> - Change heartbeat speed")
    print("  evolve <cell_id> - Force evolution")
    print("=" * 60)
    
    try:
        server.run(host="0.0.0.0", port=7777)
    except KeyboardInterrupt:
        print("\n🌙 Entering dream state...")
        legacy = brain.rest()
        print(f"Dreamed {legacy['final_pulse']} pulses")
        print(f"{legacy['legacy']['total_lives']} eternal lives remembered")


if __name__ == "__main__":
    main()
