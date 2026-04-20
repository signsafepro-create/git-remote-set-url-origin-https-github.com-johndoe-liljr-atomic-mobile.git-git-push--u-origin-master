
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';
import { api } from '../api/client';

const WAKE_WORD = 'eternal'; // Change to your wake word
const PRIVACY_WORD = 'privacy'; // Change to your privacy word

export default function VoiceService({ onCommand, onPrivacy }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wakeActive, setWakeActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setError(null);
    setTranscript('');
    try {
      await Voice.start('en-US');
      setListening(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setListening(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const onSpeechResults = async (e) => {
    const text = e.value?.join(' ') || '';
    setTranscript(text);
    if (!wakeActive && text.toLowerCase().includes(WAKE_WORD)) {
      setWakeActive(true);
      setTranscript('');
      if (onCommand) onCommand('Wake word detected');
    } else if (wakeActive) {
      if (text.toLowerCase().includes(PRIVACY_WORD)) {
        setWakeActive(false);
        setTranscript('');
        if (onPrivacy) onPrivacy('Privacy word detected');
        stopListening();
      } else if (text.trim().length > 0) {
        if (onCommand) onCommand(text);
        // Stream command to backend
        try {
          await api.post('/api/voice-command', { command: text, source: 'mobile', timestamp: Date.now() });
        } catch (err) {
          // Optionally handle error
        }
        setWakeActive(false);
        setTranscript('');
        stopListening();
      }
    }
  };

  const onSpeechError = (e) => {
    setError(e.error?.message || 'Unknown error');
    setListening(false);
    setWakeActive(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, listening ? styles.active : null]}
        onPress={listening ? stopListening : startListening}
      >
        <Text style={styles.micText}>{listening ? 'Stop' : 'Start'} Listening</Text>
      </TouchableOpacity>
      <Text style={styles.status}>{wakeActive ? 'Say your command...' : 'Say "eternal" to activate'}</Text>
      <Text style={styles.transcript}>{transcript}</Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', margin: 16 },
  micButton: {
    backgroundColor: '#222',
    borderRadius: 32,
    padding: 16,
    marginBottom: 8,
  },
  active: { backgroundColor: '#0f0' },
  micText: { color: '#fff', fontSize: 18 },
  status: { color: '#aaa', marginTop: 8 },
  transcript: { color: '#fff', marginTop: 8 },
  error: { color: 'red', marginTop: 8 },
});
