import React, { useState } from 'react';
import { Heart, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface MoodCardProps {
  mood: {
    _id: string;
    moodScore: number;
    emotions: string[];
    notes?: string;
    date: string;
    marketContext: {
      btcPrice: number;
      solPrice: number;
      fearGreedIndex: number;
    };
    likes: number;
    userId: {
      username: string;
      profilePicture?: string;
    };
  };
  onLike?: (moodId: string) => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ mood, onLike }) => {
  const [liked, setLiked] = useState(false);

  const getMoodEmoji = (score: number) => {
    if (score >= 9) return '🚀';
    if (score >= 7) return '😊';
    if (score >= 5) return '😐';
    if (score >= 3) return '😟';
    return '😰';
  };

  const getMoodColor = (score: number) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleLike = () => {
    if (onLike) {
      onLike(mood._id);
      setLiked(!liked);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{mood.userId.username[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium">{mood.userId.username}</p>
            <p className="text-sm text-gray-400">{new Date(mood.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getMoodEmoji(mood.moodScore)}</span>
          <span className={`text-lg font-bold ${getMoodColor(mood.moodScore)}`}>
            {mood.moodScore}/10
          </span>
        </div>
      </div>

      {/* Emotions */}
      {mood.emotions.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {mood.emotions.map((emotion, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-600 text-blue-100 rounded-full text-xs"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {mood.notes && (
        <div className="mb-4">
          <p className="text-gray-300">{mood.notes}</p>
        </div>
      )}

      {/* Market Context */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Market Context</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">BTC</p>
            <p className="font-medium">${mood.marketContext.btcPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400">SOL</p>
            <p className="font-medium">${mood.marketContext.solPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Fear & Greed</p>
            <p className="font-medium">{mood.marketContext.fearGreedIndex}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${liked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span>{mood.likes + (liked ? 1 : 0)}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400">
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default MoodCard;
