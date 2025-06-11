'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const emotionOptions = [
  'excited', 'confident', 'optimistic', 'calm', 'focused',
  'anxious', 'fearful', 'greedy', 'frustrated', 'overwhelmed'
];

const marketConditions = [
  { value: 'bullish', label: 'Bullish 🐂' },
  { value: 'bearish', label: 'Bearish 🐻' },
  { value: 'neutral', label: 'Neutral ⚖️' },
  { value: 'volatile', label: 'Volatile 📈📉' }
];

export default function MoodPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [moodScore, setMoodScore] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [marketCondition, setMarketCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!marketCondition || selectedEmotions.length === 0) {
      setMessage('Please select at least one emotion and market condition');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moodScore,
          emotions: selectedEmotions,
          marketCondition,
          notes
        }),
      });

      if (response.ok) {
        setMessage('Mood logged successfully!');
        // Reset form
        setMoodScore(5);
        setSelectedEmotions([]);
        setMarketCondition('');
        setNotes('');
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to log mood');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Log Your Mood</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Mood Score Slider */}
            <div>
              <label className="block text-lg font-medium mb-4">
                How are you feeling? ({moodScore}/10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Very Bad</span>
                <span>Neutral</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Emotions */}
            <div>
              <label className="block text-lg font-medium mb-4">
                What emotions are you experiencing?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => toggleEmotion(emotion)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedEmotions.includes(emotion)
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* Market Condition */}
            <div>
              <label className="block text-lg font-medium mb-4">
                How do you view the current market?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {marketConditions.map((condition) => (
                  <button
                    key={condition.value}
                    type="button"
                    onClick={() => setMarketCondition(condition.value)}
                    className={`p-4 rounded-lg border transition-colors ${
                      marketCondition === condition.value
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {condition.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-medium mb-4">
                Additional notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's influencing your mood today?"
                className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                rows={4}
                maxLength={500}
              />
              <div className="text-sm text-gray-400 mt-1">
                {notes.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isSubmitting ? 'Logging Mood...' : 'Log Mood'}
            </button>

            {message && (
              <div className={`text-center p-3 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
