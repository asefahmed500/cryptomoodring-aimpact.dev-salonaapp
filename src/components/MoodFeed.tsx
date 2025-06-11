import React from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

export const MoodFeed: React.FC = () => {
  const { moods, likeMood } = useStore();

  const getMoodEmoji = (score: number) => {
    const emojis = ['😭', '😢', '😟', '😐', '🙂', '😊', '😄', '😍', '🤩', '🚀'];
    return emojis[score - 1] || '😐';
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'text-red-400';
    if (score <= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Community Mood Feed</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {moods.map(mood => (
          <div key={mood.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getMoodEmoji(mood.moodScore)}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Anonymous Trader</span>
                    <span className={`text-lg font-bold ${getMoodColor(mood.moodScore)}`}>
                      {mood.moodScore}/10
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(new Date(mood.date))}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {mood.emotions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {mood.emotions.map(emotion => (
                  <span
                    key={emotion}
                    className="px-2 py-1 bg-gray-600 text-xs rounded-full text-gray-300"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}
            
            {mood.notes && (
              <p className="mt-2 text-gray-300">{mood.notes}</p>
            )}
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => likeMood(mood.id)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>{mood.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>{mood.comments.length}</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                BTC: ${mood.marketContext.btcPrice.toLocaleString()} | 
                SOL: ${mood.marketContext.solPrice.toFixed(0)} | 
                F&G: {mood.marketContext.fearGreedIndex}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};