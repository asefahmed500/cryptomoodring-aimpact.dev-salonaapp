// src/components/community/CreatePostForm.tsx
'use client';

import { TrendingUp, TrendingDown, Minus, Hash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface CreatePostFormProps {
  onPostCreated: (newPost: any) => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    mood: 5,
    marketSentiment: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    cryptoSymbol: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content.trim(),
          mood: formData.mood,
          marketSentiment: formData.marketSentiment,
          cryptoSymbol: formData.cryptoSymbol.trim() || undefined,
          tags: formData.tags
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated(newPost);
        setFormData({
          content: '',
          mood: 5,
          marketSentiment: 'neutral',
          cryptoSymbol: '',
          tags: ''
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 border-green-400';
      case 'bearish': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!session?.user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
        <p className="text-gray-400">Please sign in to share your thoughts with the community.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <h3 className="text-white font-medium">Share your crypto mood</h3>
          <p className="text-gray-400 text-sm">How are you feeling about the market?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="What's on your mind about crypto today?"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            maxLength={500}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              {formData.content.length}/500
            </span>
          </div>
        </div>

        {/* Mood Slider */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Current Mood: {formData.mood}/10
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.mood}
              onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, 
                  ${formData.mood <= 3 ? '#ef4444' : formData.mood <= 6 ? '#eab308' : '#22c55e'} 0%, 
                  ${formData.mood <= 3 ? '#ef4444' : formData.mood <= 6 ? '#eab308' : '#22c55e'} ${(formData.mood / 10) * 100}%, 
                  #374151 ${(formData.mood / 10) * 100}%, 
                  #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>😢 Fearful</span>
              <span>😐 Neutral</span>
              <span>😊 Euphoric</span>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Market Sentiment
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'bullish', label: 'Bullish', icon: TrendingUp },
              { value: 'neutral', label: 'Neutral', icon: Minus },
              { value: 'bearish', label: 'Bearish', icon: TrendingDown }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, marketSentiment: value as any })}
                className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border transition-colors ${
                  formData.marketSentiment === value
                    ? getSentimentColor(value) + ' bg-opacity-20'
                    : 'text-gray-400 border-gray-600 hover:border-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Crypto Symbol (Optional)
            </label>
            <input
              type="text"
              value={formData.cryptoSymbol}
              onChange={(e) => setFormData({ ...formData, cryptoSymbol: e.target.value.toUpperCase() })}
              placeholder="BTC, ETH, SOL..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Tags (Optional)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="trading, analysis, news"
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.content.trim() || isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Sharing...' : 'Share with Community'}
        </button>
      </form>
    </div>
  );
}