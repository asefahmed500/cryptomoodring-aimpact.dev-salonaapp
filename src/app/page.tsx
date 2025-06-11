'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            CryptoMoodRing
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Track your emotional intelligence in crypto trading. Make better decisions with mood-based insights.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Mood Tracking</h3>
              <p className="text-gray-400">Log your daily emotions and market sentiment to identify patterns.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-3 text-pink-400">Predictions</h3>
              <p className="text-gray-400">Make market predictions and track your accuracy over time.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Community</h3>
              <p className="text-gray-400">See how the community feels about market conditions.</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href="/auth/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/auth/signin"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-gray-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
