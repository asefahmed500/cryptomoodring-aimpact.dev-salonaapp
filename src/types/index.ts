export interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
  profilePicture?: string;
  joinDate: Date;
  stats: {
    totalMoods: number;
    accuracyScore: number;
    streakDays: number;
    totalPredictions: number;
  };
  preferences: {
    publicProfile: boolean;
    notifications: boolean;
    timezone: string;
  };
}

export interface MoodEntry {
  id: string;
  userId: string;
  date: Date;
  moodScore: number; // 1-10
  emotions: string[];
  notes: string;
  marketContext: {
    btcPrice: number;
    solPrice: number;
    fearGreedIndex: number;
  };
  isPublic: boolean;
  likes: number;
  comments: string[];
}

export interface Prediction {
  id: string;
  userId: string;
  date: Date;
  asset: string; // BTC, SOL, ETH
  prediction: 'bull' | 'bear' | 'sideways';
  confidence: number; // 1-10
  priceRange: {
    min: number;
    max: number;
  };
  timeframe: string; // 24h, 7d, 30d
  result: 'correct' | 'incorrect' | 'pending';
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  rewards: {
    first: string;
    second: string;
    third: string;
  };
  isActive: boolean;
}

export interface CommunityStats {
  averageMood: number;
  totalUsers: number;
  todaysMoods: number;
  bullishSentiment: number;
  bearishSentiment: number;
  neutralSentiment: number;
}
