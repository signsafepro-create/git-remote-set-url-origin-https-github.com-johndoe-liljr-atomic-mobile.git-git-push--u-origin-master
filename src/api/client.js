import Constants from 'expo-constants';

const API_URL =
  'https://liljr-prod-production.up.railway.app'; // Railway only, no Vercel/Netlify/localhost

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  async post(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  async get(path) {
    const res = await fetch(`${API_URL}${path}`);
    return handleResponse(res);
  },

  async health() {
    return this.get('/api/');
  },

  // Accepts optional history array for memory
  async chat(message, userId = 'mobile-user', tier = 'street', history = []) {
    return this.post('/chat', { message, userId, tier, domain: 'mobile', history });
  },

  async createCheckout(tier, email) {
    return this.post('/create-checkout', { tier, email });
  },

  async getBrainStatus() {
    return this.get('/stats');
  },

  async getNotaries(province) {
    const query = province ? `?province=${province}` : '';
    return this.get(`/signsafe/notaries${query}`);
  },

  async bookNotary(notaryId, userEmail, documentType) {
    return this.post('/signsafe/book', {
      notaryId,
      userEmail,
      documentType,
      datetime: new Date().toISOString()
    });
  }
};
