'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

interface Stats {
  totalMoods: number;
  totalPredictions: number;
  accuracyScore: number;
  streakDays: number;
}

interface RecentMood {
  _id: string;
  moodScore: number;
  emotions: string[];
  marketCondition: string;
  createdAt: string;
}

interface RecentPrediction {
  _id: string;
  symbol: string;
  direction: string;
  confidence: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMoods, setRecentMoods] = useState<RecentMood[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, moodsRes, predictionsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/moods'),
        fetch('/api/predictions')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (moodsRes.ok) {
        const moodsData = await moodsRes.json();
        setRecentMoods(moodsData.slice(0, 5));
      }

      if (predictionsRes.ok) {
        const predictionsData = await predictionsRes.json();
        setRecentPredictions(predictionsData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user?.name}!</h1>
        <p className="text-gray-400">Here's your trading psychology overview</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="text-2xl font-bold text-purple-400">{stats.totalMoods}</div>
            <div className="text-sm text-gray-400">Mood Entries</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="text-2xl font-bold text-pink-400">{stats.totalPredictions}</div>
            <div className="text-sm text-gray-400">Predictions</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="text-2xl font-bold text-green-400">{stats.accuracyScore}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="text-2xl font-bold text-blue-400">{stats.streakDays}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link 
          href="/mood"
          className="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg transition-colors block"
        >
          <h3 className="text-xl font-semibold mb-2">Log Today's Mood</h3>
          <p className="text-purple-200">Track your emotional state and market sentiment</p>
        </Link>
        <Link 
          href="/predictions"
          className="bg-pink-600 hover:bg-pink-700 p-6 rounded-lg transition-colors block"
        >
          <h3 className="text-xl font-semibold mb-2">Make a Prediction</h3>
          <p className="text-pink-200">Share your market insights and track accuracy</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Recent Moods</h3>
          {recentMoods.length > 0 ? (
            <div className="space-y-3">
              {recentMoods.map((mood) => (
                <div key={mood._id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Mood: {mood.moodScore}/10</div>
                    <div className="text-sm text-gray-400">
                      {mood.emotions.join(', ')} • {mood.marketCondition}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(mood.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No mood entries yet</p>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Recent Predictions</h3>
          {recentPredictions.length > 0 ? (
            <div className="space-y-3">
              {recentPredictions.map((prediction) => (
                <div key={prediction._id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{prediction.symbol} {prediction.direction}</div>
                    <div className="text-sm text-gray-400">
                      Confidence: {prediction.confidence}/10 • {prediction.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(prediction.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No predictions yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}