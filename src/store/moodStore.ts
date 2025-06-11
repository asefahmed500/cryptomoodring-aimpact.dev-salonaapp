import { create } from 'zustand';

interface MoodEntry {
  _id: string;
  mood: number;
  emotions: string[];
  notes?: string;
  marketCondition: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: string;
}

interface MoodStore {
  moods: MoodEntry[];
  loading: boolean;
  error: string | null;
  addMood: (mood: MoodEntry) => void;
  setMoods: (moods: MoodEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMoodStore = create<MoodStore>((set) => ({
  moods: [],
  loading: false,
  error: null,
  addMood: (mood) => set((state) => ({ moods: [mood, ...state.moods] })),
  setMoods: (moods) => set({ moods }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
