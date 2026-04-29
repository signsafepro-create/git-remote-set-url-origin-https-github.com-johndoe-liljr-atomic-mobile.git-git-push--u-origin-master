import requests
import subprocess
import time

BACKEND_URL = "http://<YOUR_PC_IP>:8000/api/get_command"
RESULT_URL = "http://<YOUR_PC_IP>:8000/api/command_result"

while True:
    try:
        resp = requests.get(BACKEND_URL)
        cmd = resp.json().get("command")
        if cmd:
            print(f"Executing: {cmd}")
            try:
                output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, timeout=60)
                result = output.decode()
            except Exception as e:
                result = str(e)
            requests.post(RESULT_URL, json={"result": result})
        time.sleep(3)
    except Exception as e:
        print(f"Listener error: {e}")
        time.sleep(5)
