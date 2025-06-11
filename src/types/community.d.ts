// src/types/community.d.ts
export interface CommunityPost {
  _id: string;
  userId: string;
  username: string;
  content: string;
  mood: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  cryptoSymbol?: string;
  tags: string[];
  likes: string[];
  comments: {
    id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  avgMood: number;
  sentiment: {
    bullish: number;
    bearish: number;
    neutral: number;
  };
  trendingTags: { tag: string; count: number }[];
  trendingSymbols: { symbol: string; count: number; avgMood: number }[];
  recentActivity: number;
}