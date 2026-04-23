
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { api } from '../api/client';

const WAKE_WORD = 'eternal'; // Change to your wake word
const PRIVACY_WORD = 'privacy'; // Change to your privacy word

export default function VoiceService({ onCommand, onPrivacy }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [wakeActive, setWakeActive] = useState(false);
  const [error, setError] = useState(null);

  // Audio recording for cloud-based speech-to-text
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access microphone was denied');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      // Send audio file to backend for transcription
      const formData = new FormData();
      formData.append('file', { uri, name: 'audio.wav', type: 'audio/wav' });
      const response = await fetch('https://your-backend-url/api/transcribe', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      setTranscript(data.transcript || '(no transcript)');
    } catch (e) {
      setError(e.message);
      setIsRecording(false);
      setRecording(null);
    }
  };

  // Voice recognition removed due to incompatibility

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, isRecording ? styles.active : null]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.micText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>
      <Text style={styles.status}>Tap to record your voice and transcribe using the cloud.</Text>
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
