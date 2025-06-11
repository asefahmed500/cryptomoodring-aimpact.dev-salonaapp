import React, { useState } from 'react';
import { api } from '../utils/api';
import { useMoodStore } from '../store/moodStore';

const emotions = [
  'excited', 'confident', 'optimistic', 'calm', 'focused',
  'anxious', 'fearful', 'greedy', 'frustrated', 'confused',
  'euphoric', 'panicked', 'hopeful', 'doubtful', 'determined'
];

const MoodForm: React.FC = () => {
  const [mood, setMood] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [marketCondition, setMarketCondition] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [confidence, setConfidence] = useState(5);
  const [loading, setLoading] = useState(false);

  const { addMood } = useMoodStore();

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmotions.length === 0) {
      alert('Please select at least one emotion');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createMood({
        mood,
        emotions: selectedEmotions,
        notes,
        marketCondition,
        confidence
      });

      addMood(response.moodEntry);
      
      // Reset form
      setMood(5);
      setSelectedEmotions([]);
      setNotes('');
      setMarketCondition('neutral');
      setConfidence(5);
      
      alert('Mood entry created successfully!');
    } catch (error) {
      console.error('Error creating mood:', error);
      alert('Failed to create mood entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Log Your Mood</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Scale */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Overall Mood (1-10): {mood}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Very Bad</span>
            <span>Neutral</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Emotions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Emotions (choose multiple):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => handleEmotionToggle(emotion)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedEmotions.includes(emotion)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Market Condition */}
        <div>
          <label className="block text-sm font-medium mb-2">Market Condition:</label>
          <select
            value={marketCondition}
            onChange={(e) => setMarketCondition(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Confidence Level (1-10): {confidence}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes (optional):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's influencing your mood today?"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            rows={3}
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Saving...' : 'Log Mood'}
        </button>
      </form>
    </div>
  );
};

export default MoodForm;
