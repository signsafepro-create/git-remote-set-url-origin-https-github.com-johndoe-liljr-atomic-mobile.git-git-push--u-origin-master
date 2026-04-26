import React, { useState, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function VoiceChatQuickWin({ onSend, backendUrl }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const synthRef = useRef(window.speechSynthesis);

  const startListening = () => {
    if (!recognition) return alert('Speech Recognition not supported');
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendToBackend(text);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const sendToBackend = async (text) => {
    if (onSend) onSend(text);
    try {
      const res = await fetch(backendUrl + '/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResponse(data.response);
      speak(data.response);
    } catch (e) {
      setResponse('Error: ' + e.message);
    }
  };

  const speak = (text) => {
    if (!synthRef.current) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    synthRef.current.speak(utter);
  };

  return (
    <div style={{ padding: 24, background: '#111', color: '#fff', borderRadius: 8, maxWidth: 500, margin: '40px auto' }}>
      <h2>🎤 Voice Chat (Quick Win)</h2>
      <button onClick={startListening} disabled={listening} style={{ fontSize: 18, padding: '10px 20px', marginBottom: 16 }}>
        {listening ? 'Listening...' : 'Start Talking'}
      </button>
      <div><b>You said:</b> {transcript}</div>
      <div style={{ marginTop: 16 }}><b>Response:</b> {response}</div>
    </div>
  );
}
