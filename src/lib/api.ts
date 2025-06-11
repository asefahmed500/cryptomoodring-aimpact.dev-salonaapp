import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-url.vercel.app' 
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
};

// Moods API
export const moodsAPI = {
  create: (moodData: any) => api.post('/moods/create', moodData),
  getCommunityToday: () => api.get('/moods/community/today'),
  likeMood: (moodId: string) => api.put(`/moods/${moodId}/like`),
};

// Predictions API
export const predictionsAPI = {
  create: (predictionData: any) => api.post('/predictions/create', predictionData),
  getLeaderboard: () => api.get('/predictions/leaderboard'),
};

// Community API
export const communityAPI = {
  getSentiment: () => api.get('/community/sentiment'),
};

export default api;
