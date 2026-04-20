import Constants from 'expo-constants';
// Use EXPO_PUBLIC_BACKEND_URL from .env or fallback to production
export const API_BASE_URL = Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL || 'https://liljr-prod-production.up.railway.app';

export const ENDPOINTS = {
  health: '/api/',
  stats: '/stats',
  chat: '/chat',
  pricing: '/pricing',
  checkout: '/create-checkout',
  voiceAuth: '/voice-auth',
  voiceCommand: '/voice-command'
};

export const TIERS = {
  street: { price: 0, name: 'Street', messages: 10, color: '#6b7280' },
  hustler: { price: 9.99, name: 'Hustler', messages: 100, color: '#00d4ff' },
  builder: { price: 29.99, name: 'Builder', messages: 500, color: '#a855f7' },
  master: { price: 99.99, name: 'Master', messages: Infinity, color: '#f472b6' },
  empire: { price: 299.99, name: 'Empire', messages: Infinity, color: '#fbbf24' }
};
