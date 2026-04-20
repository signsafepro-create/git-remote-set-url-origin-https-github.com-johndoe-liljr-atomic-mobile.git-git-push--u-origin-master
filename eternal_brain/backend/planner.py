"""
planner.py - Proactive planning and innovation engine for Eternal Brain
"""
import random
import time
from typing import List, Dict, Any

class ContingencyPlan:
    def __init__(self, description: str, trigger: str, action: str, created_at=None):
        self.description = description
        self.trigger = trigger  # What event or metric triggers this plan
        self.action = action    # What to do when triggered
        self.created_at = created_at or time.time()
        self.activated = False
        self.success = None

    def to_dict(self):
        return {
            'description': self.description,
            'trigger': self.trigger,
            'action': self.action,
            'created_at': self.created_at,
            'activated': self.activated,
            'success': self.success
        }

class OverthinkingPlanner:
    """Simulates possible futures, generates plans, and proactively adapts."""
    def __init__(self):
        self.plans: List[ContingencyPlan] = []
        self.history: List[Dict[str, Any]] = []

    def analyze_state(self, stats: Dict[str, Any]):
        """Look for warning signs and generate plans if needed."""
        # Example: If living cells drop below a threshold, plan a rescue
        if stats.get('living', 0) < 5:
            self.add_plan(
                description="Low population rescue",
                trigger="living<5",
                action="Seed new robust archetype"
            )
        # Example: If a phase is dominating, plan to diversify
        if stats.get('phase_distribution', {}).get('BURN', 0) > 10:
            self.add_plan(
                description="Too many BURN cells",
                trigger="BURN>10",
                action="Seed new cooling archetype"
            )

    def add_plan(self, description: str, trigger: str, action: str):
        # Avoid duplicate plans
        for plan in self.plans:
            if plan.trigger == trigger and not plan.activated:
                return
        self.plans.append(ContingencyPlan(description, trigger, action))

    def check_and_execute(self, stats: Dict[str, Any], seed_callback):
        """Activate plans if their trigger is met."""
        for plan in self.plans:
            if not plan.activated and self._trigger_met(plan.trigger, stats):
                # Example: execute the action (here, just call seed_callback)
                if "Seed new robust archetype" in plan.action:
                    seed_callback('rescue', self._generate_rescue_code())
                elif "Seed new cooling archetype" in plan.action:
                    seed_callback('cooler', self._generate_cooler_code())
                plan.activated = True
                plan.success = True  # In a real system, check outcome
                self.history.append(plan.to_dict())

    def _trigger_met(self, trigger: str, stats: Dict[str, Any]) -> bool:
        # Very simple trigger parser for demo
        if trigger == "living<5":
            return stats.get('living', 0) < 5
        if trigger == "BURN>10":
            return stats.get('phase_distribution', {}).get('BURN', 0) > 10
        return False

    def _generate_rescue_code(self) -> str:
        return """
def main():
    # Emergency rescue cell
    return 'I am a robust survivor!'
"""

    def _generate_cooler_code(self) -> str:
        return """
def main():
    # Cooling cell to balance BURN phase
    return 'Cooling things down.'
"""

    def get_active_plans(self) -> List[Dict[str, Any]]:
        return [p.to_dict() for p in self.plans if not p.activated]

    def get_history(self) -> List[Dict[str, Any]]:
        return self.history
