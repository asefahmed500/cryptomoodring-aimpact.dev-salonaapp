import { create } from 'zustand';

interface Prediction {
  _id: string;
  prediction: 'bullish' | 'bearish' | 'sideways';
  confidence: number;
  timeframe: '1h' | '4h' | '24h' | '7d';
  notes?: string;
  isResolved: boolean;
  actualOutcome?: 'bullish' | 'bearish' | 'sideways';
  accuracy?: number;
  createdAt: string;
  resolvedAt?: string;
}

interface PredictionStore {
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  addPrediction: (prediction: Prediction) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  predictions: [],
  loading: false,
  error: null,
  addPrediction: (prediction) => set((state) => ({ predictions: [prediction, ...state.predictions] })),
  setPredictions: (predictions) => set({ predictions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
