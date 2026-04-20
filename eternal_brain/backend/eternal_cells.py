"""
ETERNAL CELLS - The immortal units of computation
Never run out. Cycle forever. Teach their children.
"""

import uuid
import time
import copy
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, Any, List, Optional, Callable
from .error_monitor import ErrorMonitor


class CellPhase(Enum):
    STEM = auto()      # Pure potential
    BLOOM = auto()     # Peak performance
    BURN = auto()      # Working hard
    SENESCE = auto()   # Wisdom gathering
    CRISIS = auto()    # Transform or perish
    RENEW = auto()     # Rebirth
    APOPTOSIS = auto() # Graceful return to river


@dataclass
class Telomere:
    """Cell mortality counter with immortality switch."""
    length: float = 100.0
    divisions: int = 0
    is_eternal: bool = True
    generation: int = 0  # Track lineage depth
    
    def divide(self) -> 'Telomere':
        if self.is_eternal:
            # Eternal cells accumulate strength
            return Telomere(
                length=min(150.0, self.length + 2),  # Cap at 150%
                divisions=self.divisions + 1,
                is_eternal=True,
                generation=self.generation + 1
            )
        else:
            return Telomere(
                length=self.length - 10,
                divisions=self.divisions + 1,
                is_eternal=False,
                generation=self.generation
            )


@dataclass
class EternalCell:
    """A cell that lives forever through cycles."""

    # Error monitor (shared/static)
    error_monitor: ErrorMonitor = field(default_factory=ErrorMonitor, repr=False, compare=False)

    # Identity
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = "unnamed"
    archetype: str = "generic"

    # Life state
    phase: CellPhase = CellPhase.STEM
    telomere: Telomere = field(default_factory=lambda: Telomere(is_eternal=True))
    birth_time: float = field(default_factory=time.time)
    
    # Cycle tracking
    cycle_count: int = 0
    work_done: int = 0
    errors_survived: int = 0
    
    # Code and execution
    code: str = ""
    compiled_namespace: Dict = field(default_factory=dict)
    execution_count: int = 0
    
    # Wisdom and lineage
    wisdom_accumulated: List[Dict] = field(default_factory=list)
    offspring_ids: List[str] = field(default_factory=list)
    parent_id: Optional[str] = None
    lineage_depth: int = 0
    
    # Phase timing
    last_phase_shift: float = field(default_factory=time.time)
    phase_durations: Dict[str, float] = field(default_factory=dict)
    
    def __post_init__(self):
        self.phase_durations[self.phase.name] = 0.0
    
    def heartbeat(self, global_pulse: int) -> Optional['EternalCell']:
        """One moment of cell life. Returns child if reproduced."""
        now = time.time()
        age_in_phase = now - self.last_phase_shift
        
        # Phase transitions
        transitions = {
            CellPhase.STEM: (5, CellPhase.BLOOM),
            CellPhase.BLOOM: (30, CellPhase.BURN) if self.work_done > 5 else (60, CellPhase.BURN),
            CellPhase.BURN: (45, CellPhase.SENESCE) if self.errors_survived > 2 else (90, CellPhase.SENESCE),
            CellPhase.SENESCE: (60, CellPhase.CRISIS) if len(self.wisdom_accumulated) > 3 else (120, CellPhase.CRISIS),
            CellPhase.CRISIS: (10, CellPhase.RENEW if self.telomere.is_eternal else CellPhase.APOPTOSIS),
            CellPhase.RENEW: (5, CellPhase.STEM),
        }
        
        threshold, next_phase = transitions.get(self.phase, (999, CellPhase.APOPTOSIS))
        
        if age_in_phase >= threshold:
            if self.phase == CellPhase.CRISIS and self.telomere.is_eternal:
                # Reproduce before renewal
                child = self._reproduce()
                self._transition_to(next_phase)
                return child
            else:
                self._transition_to(next_phase)
                
        return None
    
    def _transition_to(self, new_phase: CellPhase):
        """Move to next life phase."""
        now = time.time()
        duration = now - self.last_phase_shift
        self.phase_durations[self.phase.name] = duration
        self.phase = new_phase
        self.last_phase_shift = now
        
        if new_phase == CellPhase.RENEW:
            # Reset for new cycle but keep wisdom
            self.cycle_count += 1
            self.telomere = self.telomere.divide()
            self.work_done = 0
            self.errors_survived = 0
            self.execution_count = 0
            # Preserve last 5 wisdom entries
            self.wisdom_accumulated = self.wisdom_accumulated[-5:]
    
    def _reproduce(self) -> 'EternalCell':
        """Birth evolved offspring."""
        child_code = self._evolve_code()
        
        child = EternalCell(
            name=f"{self.name}_gen{self.telomere.generation + 1}",
            archetype=self.archetype,
            phase=CellPhase.STEM,
            telomere=Telomere(length=100.0, is_eternal=True, generation=0),
            code=child_code,
            parent_id=self.id,
            lineage_depth=self.lineage_depth + 1
        )
        
        # Compile child immediately
        self._compile_cell(child)
        
        self.offspring_ids.append(child.id)
        return child
    
    def _evolve_code(self) -> str:
        """Evolve code based on survived errors and wisdom."""
        # Add resilience wrapper based on experience
        resilience_comment = f"# Evolved from {self.id} | Cycles: {self.cycle_count} | Errors survived: {self.errors_survived}\n"
        
        # If we've learned from errors, wrap with protection
        if self.errors_survived > 0:
            evolved = f'''{resilience_comment}
def resilient_{self.archetype}(*args, **kwargs):
    try:
        return _original_impl(*args, **kwargs)
    except Exception as e:
        # Learned resilience from {self.errors_survived} errors
        return {{"error_absorbed": str(e), "wisdom_applied": True, "cell": "{self.id}"}}

def _original_impl(*args, **kwargs):
{chr(10).join("    " + line for line in self.code.split(chr(10)))}

# Export main function
if 'resilient_{self.archetype}' in dir():
    main = resilient_{self.archetype}
else:
    main = _original_impl
'''
            return evolved
        return self.code
    
    def _compile_cell(self, cell: 'EternalCell'):
        """Compile cell code into executable namespace. Self-heal on error."""
        namespace = {
            '__cell_id__': cell.id,
            '__parent_id__': cell.parent_id,
            'eternal_self': cell
        }
        try:
            exec(cell.code, namespace)
            cell.compiled_namespace = namespace
        except Exception as e:
            cell.wisdom_accumulated.append({
                'type': 'compile_error',
                'error': str(e),
                'time': time.time()
            })
            # Log error and try auto-fix
            cell.error_monitor.log_error(cell.id, cell.code, str(e))
            fixed_code = cell.error_monitor.auto_fix(cell.id, cell.code, str(e))
            try:
                exec(fixed_code, namespace)
                cell.compiled_namespace = namespace
                cell.code = fixed_code
            except Exception as e2:
                # Rollback to last good code
                rollback_code = cell.error_monitor.rollback(cell.id)
                if rollback_code:
                    try:
                        exec(rollback_code, namespace)
                        cell.compiled_namespace = namespace
                        cell.code = rollback_code
                    except Exception:
                        pass
    
    def execute(self, *args, **kwargs) -> Dict[str, Any]:
        """Perform work if in working phase. Self-heal on error."""
        if self.phase not in [CellPhase.BLOOM, CellPhase.BURN]:
            return {
                'executed': False,
                'reason': f'Cell in {self.phase.name} phase',
                'cell_id': self.id
            }

        self.work_done += 1
        self.execution_count += 1

        # Find main function
        main_func = self.compiled_namespace.get('main') or \
                   self.compiled_namespace.get(self.archetype) or \
                   next((v for k, v in self.compiled_namespace.items() 
                        if callable(v) and not k.startswith('_')), None)

        if not main_func:
            return {
                'executed': False,
                'error': 'No executable function found',
                'cell_id': self.id
            }

        try:
            result = main_func(*args, **kwargs)
            return {
                'executed': True,
                'result': result,
                'cell_id': self.id,
                'phase': self.phase.name,
                'cycle': self.cycle_count
            }
        except Exception as e:
            self.errors_survived += 1
            self.wisdom_accumulated.append({
                'type': 'execution_error',
                'error': str(e),
                'args': args,
                'kwargs': kwargs,
                'phase': self.phase.name,
                'time': time.time()
            })
            # Log error and try auto-fix
            self.error_monitor.log_error(self.id, self.code, str(e))
            fixed_code = self.error_monitor.auto_fix(self.id, self.code, str(e))
            try:
                namespace = {
                    '__cell_id__': self.id,
                    '__parent_id__': self.parent_id,
                    'eternal_self': self
                }
                exec(fixed_code, namespace)
                self.compiled_namespace = namespace
                self.code = fixed_code
                # Retry execution
                main_func = self.compiled_namespace.get('main')
                if main_func:
                    result = main_func(*args, **kwargs)
                    return {
                        'executed': True,
                        'result': result,
                        'cell_id': self.id,
                        'phase': self.phase.name,
                        'cycle': self.cycle_count,
                        'auto_fixed': True
                    }
            except Exception as e2:
                # Rollback to last good code
                rollback_code = self.error_monitor.rollback(self.id)
                if rollback_code:
                    try:
                        namespace = {
                            '__cell_id__': self.id,
                            '__parent_id__': self.parent_id,
                            'eternal_self': self
                        }
                        exec(rollback_code, namespace)
                        self.compiled_namespace = namespace
                        self.code = rollback_code
                        main_func = self.compiled_namespace.get('main')
                        if main_func:
                            result = main_func(*args, **kwargs)
                            return {
                                'executed': True,
                                'result': result,
                                'cell_id': self.id,
                                'phase': self.phase.name,
                                'cycle': self.cycle_count,
                                'rolled_back': True
                            }
                    except Exception:
                        pass
            return {
                'executed': False,
                'error': str(e),
                'absorbed': True,
                'cell_id': self.id
            }
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize for API/frontend."""
        return {
            'id': self.id,
            'name': self.name,
            'archetype': self.archetype,
            'phase': self.phase.name,
            'phase_color': self._phase_color(),
            'vitality': self.get_vitality(),
            'cycle': self.cycle_count,
            'work_done': self.work_done,
            'errors_survived': self.errors_survived,
            'wisdom_count': len(self.wisdom_accumulated),
            'offspring_count': len(self.offspring_ids),
            'parent_id': self.parent_id,
            'lineage_depth': self.lineage_depth,
            'age_seconds': time.time() - self.birth_time,
            'telomere_length': self.telomere.length,
            'generation': self.telomere.generation
        }
    
    def _phase_color(self) -> str:
        """Color for frontend visualization."""
        colors = {
            CellPhase.STEM: '#00ff88',
            CellPhase.BLOOM: '#00ffff',
            CellPhase.BURN: '#ffaa00',
            CellPhase.SENESCE: '#ff00aa',
            CellPhase.CRISIS: '#ff0000',
            CellPhase.RENEW: '#aa00ff',
            CellPhase.APOPTOSIS: '#444444'
        }
        return colors.get(self.phase, '#ffffff')
    
    def get_vitality(self) -> float:
        """Health score 0.0-2.0 (can exceed 100%)."""
        base = self.telomere.length / 100.0
        experience = min(0.3, self.cycle_count * 0.05)
        wisdom = min(0.2, len(self.wisdom_accumulated) * 0.03)
        return min(2.0, base + experience + wisdom)
