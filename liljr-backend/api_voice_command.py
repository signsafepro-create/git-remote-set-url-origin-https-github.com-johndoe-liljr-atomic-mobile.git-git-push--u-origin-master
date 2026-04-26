# liljr-backend/api_voice_command.py
from flask import Blueprint, request, jsonify
import subprocess

api_voice_command = Blueprint('api_voice_command', __name__)

@api_voice_command.route('/api/voice-command', methods=['POST'])
def handle_voice_command():
    data = request.get_json()
    command_text = data.get('command', '').lower()
    result = ''
    try:
        # Example: open app
        if 'open' in command_text:
            app_name = command_text.split('open')[-1].strip()
            subprocess.run([app_name], check=True)
            result = f"Opened {app_name}"
        # Example: send SMS
        elif 'sms' in command_text:
            # Integrate with SMS API or system here
            result = "SMS command received"
        # Example: make call
        elif 'call' in command_text:
            # Integrate with phone/call API here
            result = "Call command received"
        else:
            result = f"Command received: {command_text}"
    except Exception as e:
        result = f"Error: {str(e)}"
    return jsonify({'result': result})
