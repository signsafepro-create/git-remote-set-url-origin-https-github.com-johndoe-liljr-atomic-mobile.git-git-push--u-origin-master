from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello, World!"}

@app.get("/get_result")
def get_result():
    return {"message": "This is the result!"}

@app.post("/queue_command")
def queue_command(command: str):
    return {"message": f"Command {command} queued!"}
