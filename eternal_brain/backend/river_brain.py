"""
RIVER BRAIN - The eternal orchestrator
Frontend connects here via WebSocket/API
"""

import threading
import time
import asyncio
from typing import Dict, Any, Optional, Callable
from dataclasses import dataclass, field

from .bloodstream import Bloodstream
from .eternal_cells import EternalCell
from .planner import OverthinkingPlanner

@dataclass
class RiverBrain:
    """The complete eternal brain system."""
    
    bloodstream: Bloodstream = field(default_factory=Bloodstream)
    heartbeat_active: bool = False
    pulse_count: int = 0
    bpm: float = 60.0  # beats per minute
    
    # Callbacks for frontend updates
    on_pulse: Optional[Callable] = None
    on_birth: Optional[Callable] = None
    on_death: Optional[Callable] = None

    # Proactive planner
    planner: OverthinkingPlanner = field(default_factory=OverthinkingPlanner)
    
    def __post_init__(self):
        self._thread: Optional[threading.Thread] = None
        self._lock = threading.Lock()
    
    def seed_archetype(self, name: str, code: str) -> EternalCell:
        """Plant eternal cell line."""
        return self.bloodstream.seed(name, code, archetype=name)
    
    def awaken(self):
        """Start eternal heartbeat."""
        self.heartbeat_active = True
        self._thread = threading.Thread(target=self._heart_loop, daemon=True)
        self._thread.start()
    
    def _heart_loop(self):
        """Never stops."""
        while self.heartbeat_active:
            start = time.time()
            with self._lock:
                result = self.bloodstream.pulse()
                self.pulse_count += 1

                # Proactive planning: analyze and execute plans
                stats = self.bloodstream.get_population_stats()
                self.planner.analyze_state(stats)
                self.planner.check_and_execute(stats, self.seed_archetype)

            # Notify frontend
            if result['new_cells'] and self.on_birth:
                for cell in result['new_cells']:
                    self.on_birth(cell)

            if result['dead_count'] > 0 and self.on_death:
                self.on_death(result['dead_count'])

            if self.on_pulse:
                self.on_pulse({
                    'pulse': self.pulse_count,
                    'stats': stats,
                    'cells': self.bloodstream.get_all_cells()
                })

            # Maintain BPM
            elapsed = time.time() - start
            sleep_time = max(0, (60.0 / self.bpm) - elapsed)
            time.sleep(sleep_time)
    
    def invoke(self, name: str, *args, **kwargs) -> Dict[str, Any]:
        """Execute a cell."""
        cell = self.bloodstream.get_by_name(name)
        if not cell:
            return {'error': f'No cell named {name}'}
        return cell.execute(*args, **kwargs)
    
    def get_status(self) -> Dict[str, Any]:
        """Full system status."""
        return {
            'alive': self.heartbeat_active,
            'pulse_count': self.pulse_count,
            'bpm': self.bpm,
            'population': self.bloodstream.get_population_stats(),
            'cells': self.bloodstream.get_all_cells()
        }
    
    def set_bpm(self, new_bpm: float):
        """Change heartbeat speed."""
        self.bpm = max(1.0, min(300.0, new_bpm))
    
    def force_evolve(self, cell_id: str, new_code: str) -> Dict[str, Any]:
        """Trigger evolution."""
        success = self.bloodstream.force_evolution(cell_id, new_code)
        return {'success': success, 'cell_id': cell_id}
    
    def rest(self) -> Dict[str, Any]:
        """Graceful shutdown."""
        self.heartbeat_active = False
        if self._thread:
            self._thread.join(timeout=3)
        
        return {
            'final_pulse': self.pulse_count,
            'legacy': {
                'total_lives': self.bloodstream.total_cells_ever,
                'remembered': len(self.bloodstream.river_of_dead),
                'lineages': len(self.bloodstream.cell_lineages)
            }
        }
