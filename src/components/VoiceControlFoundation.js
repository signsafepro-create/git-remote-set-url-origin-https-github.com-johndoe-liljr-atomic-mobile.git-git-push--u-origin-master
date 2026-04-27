// src/components/VoiceControlFoundation.js
import React, { useEffect, useRef, useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceControlFoundation({ backendUrl }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const text = event.results[event.results.length - 1][0].transcript;
      setTranscript(text);
      sendToBackend(text);
    };
    recognitionRef.current = recognition;
  }, []);

  const startListening = async () => {
    if (!SpeechRecognition) return alert('Speech Recognition not supported');
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current.stop();
  };

  // Send transcript as shell command to backend for execution
  // If the command is 'update now', trigger the update workflow
  const sendToBackend = async (command) => {
    if (command.trim().toLowerCase() === 'update now') {
      setTranscript(t => t + '\nTriggering update...');
      try {
        // Dynamically import expo-updates and trigger update
        const Updates = await import('expo-updates');
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setTranscript(t => t + '\nUpdate downloaded! Restarting...');
          await Updates.reloadAsync();
        } else {
          setTranscript(t => t + '\nApp is up to date.');
        }
      } catch (e) {
        setTranscript(t => t + '\nUpdate failed: ' + e.message);
      }
      return;
    }
    try {
      const res = await fetch(backendUrl + '/api/run_command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      setTranscript(t => t + '\n' + (data.output || data.result || JSON.stringify(data)));
    } catch (e) {
      setTranscript(t => t + '\nError: ' + e.message);
    }
  };

  return (
    <div style={{ background: '#111', color: '#fff', padding: 24, borderRadius: 8, maxWidth: 500, margin: '40px auto' }}>
      <h2>🎤 Voice Control Foundation</h2>
      <button onClick={listening ? stopListening : startListening} style={{ fontSize: 18, padding: '10px 20px', marginBottom: 16 }}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div><b>Last Command:</b> {transcript}</div>
    </div>
  );
}
