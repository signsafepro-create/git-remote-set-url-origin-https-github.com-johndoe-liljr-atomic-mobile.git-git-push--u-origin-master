import React from 'react';
import VoiceChatQuickWin from '../components/VoiceChatQuickWin';

export default function VoiceChatScreen() {
  // Set your backend API URL here or use env/config
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
  return <VoiceChatQuickWin backendUrl={backendUrl} />;
}
