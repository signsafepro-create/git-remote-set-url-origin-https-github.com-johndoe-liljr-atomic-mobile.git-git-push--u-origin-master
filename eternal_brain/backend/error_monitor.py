"""
error_monitor.py - Self-healing error monitor and rollback for Eternal Brain
"""
from collections import defaultdict
from typing import Dict, List
import time
import copy
from .nl2code import NL2Code

class ErrorMonitor:
    def __init__(self):
        self.error_log: List[Dict] = []
        self.code_versions: Dict[str, List[str]] = defaultdict(list)  # cell_id -> [code versions]
        self.last_good_code: Dict[str, str] = {}
        self.nl2code = NL2Code()

    def log_error(self, cell_id: str, code: str, error: str):
        self.error_log.append({
            'cell_id': cell_id,
            'code': code,
            'error': error,
            'timestamp': time.time()
        })
        # Save last good code for rollback
        if cell_id not in self.code_versions or (self.code_versions[cell_id] and self.code_versions[cell_id][-1] != code):
            self.code_versions[cell_id].append(code)

    def rollback(self, cell_id: str):
        # Roll back to last good code
        if self.code_versions[cell_id]:
            return self.code_versions[cell_id][-1]
        return None

    def auto_fix(self, cell_id: str, code: str, error: str) -> str:
        """Ask LLM to fix the code based on the error."""
        prompt = f"""
You are an expert Python developer. The following code has an error. Fix it.
Code:
{code}
Error:
{error}
Fixed code:
"""
        fixed_code = self.nl2code.generate_code(prompt)
        return fixed_code

    def get_error_log(self, limit=20):
        return self.error_log[-limit:]
