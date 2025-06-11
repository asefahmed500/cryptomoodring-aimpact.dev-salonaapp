const API_BASE = '/api';

interface MoodData {
  mood: number;
  emotions: string[];
  notes?: string;
  marketCondition: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
}

interface PredictionData {
  prediction: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  timeframe: '1h' | '4h' | '24h' | '7d';
  notes?: string;
}

export const api = {
  // Mood endpoints
  async createMood(data: MoodData) {
    const response = await fetch(`${API_BASE}/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create mood');
    }

    return response.json();
  },

  async getMoods(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE}/moods?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch moods');
    }

    return response.json();
  },

  // Prediction endpoints
  async createPrediction(data: PredictionData) {
    const response = await fetch(`${API_BASE}/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create prediction');
    }

    return response.json();
  },

  async getPredictions(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE}/predictions?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }

    return response.json();
  },

  // Stats endpoint
  async getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },

  // Auth endpoints
  async signup(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    return response.json();
  }
};
