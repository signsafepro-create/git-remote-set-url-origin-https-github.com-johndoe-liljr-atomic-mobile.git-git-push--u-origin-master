import React from 'react';
import VoiceControlFoundation from '../components/VoiceControlFoundation';

export default function VoiceControlScreen() {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
  return <VoiceControlFoundation backendUrl={backendUrl} />;
}
