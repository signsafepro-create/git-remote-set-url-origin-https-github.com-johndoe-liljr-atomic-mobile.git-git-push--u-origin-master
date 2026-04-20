npx expo eject"""
BLOODSTREAM - The flowing medium of eternal cells
Never depleted. Always renewing. Remembers all.
"""

import time
import random
from typing import Dict, List, Optional, Set
from dataclasses import dataclass, field

from .eternal_cells import EternalCell, CellPhase

@dataclass
class Bloodstream:
    """The living river of cells."""
    
    cells: Dict[str, EternalCell] = field(default_factory=dict)
    archetypes: Dict[str, str] = field(default_factory=dict)
    
    # Memory
    river_of_dead: List[EternalCell] = field(default_factory=list)
    cell_lineages: Dict[str, List[str]] = field(default_factory=dict)
    
    # Stats
    generation: int = 0
    total_cells_ever: int = 0
    births_this_cycle: int = 0
    deaths_this_cycle: int = 0
    
    # Configuration
    auto_rescue_threshold: int = 2  # Min cells per archetype
    
    def seed(self, name: str, code: str, archetype: str = None) -> EternalCell:
        """Plant a new eternal cell line."""
        cell = EternalCell(
            name=name,
            archetype=archetype or name,
            code=code
        )
        cell._compile_cell(cell)
        
        self.cells[cell.id] = cell
        self.cell_lineages[cell.id] = [cell.id]
        self.total_cells_ever += 1
        
        if archetype:
            self.archetypes[archetype] = code
        
        return cell
    
    def pulse(self) -> Dict[str, any]:
        """One heartbeat: all cells age, reproduce, die, renew."""
        new_cells = []
        dead_ids = []
        
        self.births_this_cycle = 0
        self.deaths_this_cycle = 0
        
        # Process each living cell
        for cell_id, cell in list(self.cells.items()):
            # Heartbeat
            child = cell.heartbeat(self.generation)

            # Ensure lineage exists for parent
            if cell_id not in self.cell_lineages:
                self.cell_lineages[cell_id] = [cell_id]

            # Handle reproduction
            if child:
                self.cells[child.id] = child
                # Ensure lineage exists for parent (again, for safety)
                if cell_id not in self.cell_lineages:
                    self.cell_lineages[cell_id] = [cell_id]
                self.cell_lineages[cell_id].append(child.id)
                self.cell_lineages[child.id] = [child.id]  # Start new lineage for child
                new_cells.append(child)
                self.total_cells_ever += 1
                self.births_this_cycle += 1

            # Handle death
            if cell.phase == CellPhase.APOPTOSIS:
                dead_ids.append(cell_id)
                self.river_of_dead.append(cell)
                self.deaths_this_cycle += 1
        
        # Clean dead
        for dead_id in dead_ids:
            del self.cells[dead_id]
        
        # Auto-rescue endangered archetypes
        self._rescue_endangered()
        
        self.generation += 1
        
        return {
            'new_cells': [c.to_dict() for c in new_cells],
            'dead_count': len(dead_ids),
            'living_count': len(self.cells)
        }
    
    def _rescue_endangered(self):
        """Ensure eternal lines never die out."""
        # Group by archetype
        archetype_counts: Dict[str, List[EternalCell]] = {}
        for cell in self.cells.values():
            if cell.archetype not in archetype_counts:
                archetype_counts[cell.archetype] = []
            archetype_counts[cell.archetype].append(cell)
        
        # Rescue if below threshold
        for archetype, count in [(a, len(c)) for a, c in archetype_counts.items()]:
            living_non_senescent = len([
                c for c in archetype_counts.get(archetype, [])
                if c.phase not in [CellPhase.APOPTOSIS, CellPhase.SENESCE]
            ])
            
            if living_non_senescent < self.auto_rescue_threshold and archetype in self.archetypes:
                # Emergency seed
                rescue_cell = EternalCell(
                    name=f"{archetype}_rescue_{int(time.time())}",
                    archetype=archetype,
                    code=self.archetypes[archetype],
                    phase=CellPhase.BLOOM  # Skip stem, go straight to work
                )
                rescue_cell._compile_cell(rescue_cell)
                self.cells[rescue_cell.id] = rescue_cell
                self.total_cells_ever += 1
                self.births_this_cycle += 1
    
    def get_by_name(self, name: str) -> Optional[EternalCell]:
        """Find best matching cell."""
        candidates = [
            c for c in self.cells.values()
            if c.name == name or c.name.startswith(name) or c.archetype == name
        ]
        
        if not candidates:
            return None
        
        # Prefer working phases with high vitality
        working = [c for c in candidates if c.phase in [CellPhase.BLOOM, CellPhase.BURN]]
        if working:
            return max(working, key=lambda c: c.get_vitality())
        
        return max(candidates, key=lambda c: c.get_vitality())
    
    def get_population_stats(self) -> Dict:
        """Current state of the eternal population."""
        if not self.cells:
            return {'status': 'empty'}
        
        phases = {p.name: 0 for p in CellPhase}
        vitalities = []
        archetype_counts: Dict[str, int] = {}
        
        for cell in self.cells.values():
            phases[cell.phase.name] += 1
            vitalities.append(cell.get_vitality())
            archetype_counts[cell.archetype] = archetype_counts.get(cell.archetype, 0) + 1
        
        return {
            'generation': self.generation,
            'living': len(self.cells),
            'remembered_dead': len(self.river_of_dead),
            'total_ever': self.total_cells_ever,
            'average_vitality': sum(vitalities) / len(vitalities),
            'max_vitality': max(vitalities),
            'phase_distribution': phases,
            'archetypes': archetype_counts,
            'lineages': len(self.cell_lineages),
            'births_last_cycle': self.births_this_cycle,
            'deaths_last_cycle': self.deaths_this_cycle
        }
    
    def get_all_cells(self) -> List[Dict]:
        """All living cells as dicts."""
        return [c.to_dict() for c in self.cells.values()]
    
    def force_evolution(self, cell_id: str, new_code: str) -> bool:
        """Accelerate a cell into crisis."""
        if cell_id not in self.cells:
            return False
        
        cell = self.cells[cell_id]
        cell.code = new_code
        cell._compile_cell(cell)
        cell.phase = CellPhase.CRISIS
        cell.last_phase_shift = time.time()
        return True
