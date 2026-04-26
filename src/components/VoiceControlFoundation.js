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

  const sendToBackend = async (command) => {
    try {
      await fetch(backendUrl + '/api/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
    } catch (e) {
      // Optionally handle error
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
