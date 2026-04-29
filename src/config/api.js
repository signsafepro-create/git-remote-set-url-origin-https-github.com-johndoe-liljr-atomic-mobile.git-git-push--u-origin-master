

// Set your backend URL here (local/server/phone)
// Try to load from environment or fallback to local server

// Set to your phone/server IP for direct connection
let API_BASE_URL = 'http://192.168.2.51:8000'; // Phone IP
if (typeof process !== 'undefined' && process.env && process.env.LILJR_API_URL) {
  API_BASE_URL = process.env.LILJR_API_URL;
}
// For React Native, you can also set this via a config file or UI
export { API_BASE_URL };

export const ENDPOINTS = {
  health: '/api/',
  stats: '/stats',
  chat: '/chat',
  pricing: '/pricing',
  // checkout: '/create-checkout',
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
