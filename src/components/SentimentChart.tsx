import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import { TrendingUp, Users, Activity } from 'lucide-react';


interface SentimentDataItem {
  name: string;
  value: number;
  color: string;
}

const mockTrendData = [
  { date: 'Mon', mood: 6.2, btc: 44000 },
  { date: 'Tue', mood: 7.1, btc: 45200 },
  { date: 'Wed', mood: 5.8, btc: 43800 },
  { date: 'Thu', mood: 8.2, btc: 46500 },
  { date: 'Fri', mood: 7.5, btc: 45800 },
  { date: 'Sat', mood: 6.9, btc: 44900 },
  { date: 'Sun', mood: 7.8, btc: 46200 }
];

const COLORS = ['#8B5CF6', '#EC4899', '#10B981'];

export const SentimentChart: React.FC = () => {
  const communityStats = useStore((state) => state.communityStats);
  
  const sentimentData: SentimentDataItem[] = [
    { name: 'Bullish', value: communityStats.bullishSentiment, color: COLORS[2] },
    { name: 'Bearish', value: communityStats.bearishSentiment, color: COLORS[1] },
    { name: 'Neutral', value: communityStats.neutralSentiment, color: COLORS[0] }
  ];
  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Average Mood</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {communityStats.averageMood.toFixed(1)}/10
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {communityStats.totalUsers.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Today's Moods</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {communityStats.todaysMoods}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Community Mood Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {sentimentData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-300">{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
