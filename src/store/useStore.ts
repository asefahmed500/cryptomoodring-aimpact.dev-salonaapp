import { create } from 'zustand';

export interface Mood {
  id: string;
  moodScore: number;
  emotions: string[];
  notes?: string;
  likes: number;
  comments: string[];
  date: Date;
  marketContext: {
    btcPrice: number;
    solPrice: number;
    fearGreedIndex: number;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  stats: {
    totalMoods: number;
    accuracyScore: number;
    streakDays: number;
    totalPredictions: number;
  };
}

interface CommunityStats {
  averageMood: number;
  totalUsers: number;
  todaysMoods: number;
  bullishSentiment: number;
  bearishSentiment: number;
  neutralSentiment: number;
}

interface AppState {
  addPrediction: (prediction: any) => void;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  moods: Mood[];
  communityStats: CommunityStats;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  likeMood: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  moods: [],
  communityStats: {
    averageMood: 0,
    totalUsers: 0,
    todaysMoods: 0,
    bullishSentiment: 0,
    bearishSentiment: 0,
    neutralSentiment: 0,
  },
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, token: null }),
  likeMood: (id) =>
    set((state) => ({
      moods: state.moods.map((mood) =>
        mood.id === id ? { ...mood, likes: mood.likes + 1 } : mood
      ),
    })),
  addPrediction: (prediction) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            stats: {
              ...state.user.stats,
              totalPredictions: state.user.stats.totalPredictions + 1,
            },
          }
        : null,
    })),
}));
