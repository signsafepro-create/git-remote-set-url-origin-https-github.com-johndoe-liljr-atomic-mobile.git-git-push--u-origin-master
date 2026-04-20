"""
nl2code.py - Natural Language to Code engine for Eternal Brain
"""
import openai  # You must set up your OpenAI API key in the environment
import os

class NL2Code:
    """Converts natural language instructions to Python code using OpenAI API."""
    def __init__(self, model="gpt-4"):
        self.model = model
        self.api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.api_key

    def generate_code(self, instruction: str) -> str:
        prompt = f"""
You are an expert Python developer. Write a Python function based on this instruction:
Instruction: {instruction}
Function code:
"""
        response = openai.Completion.create(
            engine=self.model,
            prompt=prompt,
            max_tokens=150,
            temperature=0.7,
            n=1,
            stop=None
        )
        code = response.choices[0].text.strip()
        return code
