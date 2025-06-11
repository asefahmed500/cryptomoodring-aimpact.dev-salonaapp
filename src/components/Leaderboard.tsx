import React from 'react';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import { useStore } from '../store/useStore';

const mockLeaderboard = [
  { rank: 1, username: 'CryptoSage', accuracy: 89, predictions: 45, points: 2340 },
  { rank: 2, username: 'DiamondHands', accuracy: 85, predictions: 38, points: 2180 },
  { rank: 3, username: 'MoonTrader', accuracy: 82, predictions: 52, points: 2050 },
  { rank: 4, username: 'HODLMaster', accuracy: 79, predictions: 41, points: 1920 },
  { rank: 5, username: 'CryptoTrader', accuracy: 78, predictions: 12, points: 1850 },
];

export const Leaderboard: React.FC = () => {
  const user = useStore(state => state.user);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          <Trophy className="inline mr-2" size={24} />
          Leaderboard
        </h2>
        {user && (
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
              Your rank: {mockLeaderboard.findIndex(u => u.username === user.username) + 1 || 'N/A'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {mockLeaderboard.map((entry) => (
          <div 
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-lg transition-all 
              ${user?.username === entry.username 
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium w-6 text-center">
                {getRankIcon(entry.rank)}
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {entry.username}
                  {user?.username === entry.username && (
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(You)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.predictions} predictions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                <p className="font-medium flex items-center">
                  <TrendingUp className="mr-1" size={16} />
                  {entry.accuracy}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Points</p>
                <p className="font-medium flex items-center">
                  <Award className="mr-1" size={16} />
                  {entry.points}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};