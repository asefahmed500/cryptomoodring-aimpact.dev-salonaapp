'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ArrowLeft, Target, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Updated to match your Mongoose schema
const TIMEFRAMES = [
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1m', label: '1 month' }
];

const POPULAR_SYMBOLS = [
  'BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK'
];

interface Prediction {
  _id: string;
  symbol: string;
  direction: 'up' | 'down';
  confidence: number;
  targetPrice?: number;
  timeframe: string;
  reasoning: string;
  status: 'pending' | 'correct' | 'incorrect';
  actualPrice?: number;
  resolvedAt?: string;
  createdAt: string;
}

export default function PredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    symbol: '',
    direction: '' as 'up' | 'down',
    confidence: 5,
    targetPrice: '',
    timeframe: '1d',
    reasoning: ''
  });
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchPredictions();
    }
  }, [session]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/predictions');
      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setError('Error fetching predictions');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.direction || !formData.reasoning.trim()) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        symbol: formData.symbol.toUpperCase(),
        direction: formData.direction,
        confidence: formData.confidence,
        timeframe: formData.timeframe,
        reasoning: formData.reasoning.trim(),
        ...(formData.targetPrice && { targetPrice: parseFloat(formData.targetPrice) })
      };

      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          symbol: '',
          direction: '' as 'up' | 'down',
          confidence: 5,
          targetPrice: '',
          timeframe: '1d',
          reasoning: ''
        });
        fetchPredictions();
        showMessage('Prediction created successfully!');
      } else {
        showMessage(data.message || 'Failed to create prediction', true);
      }
    } catch (error) {
      console.error('Error creating prediction:', error);
      showMessage('Error creating prediction', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTimeframeLabel = (value: string) => {
    const timeframe = TIMEFRAMES.find(t => t.value === value);
    return timeframe ? timeframe.label : value;
  };

  const resolvePrediction = async (predictionId: string, isCorrect: boolean) => {
    const actualPriceStr = prompt('Enter the actual price:');
    
    if (!actualPriceStr) return;
    
    const actualPrice = parseFloat(actualPriceStr);
    
    if (isNaN(actualPrice) || actualPrice <= 0) {
      showMessage('Please enter a valid positive number for the actual price', true);
      return;
    }

    try {
      const response = await fetch('/api/predictions/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predictionId,
          actualPrice,
          isCorrect
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchPredictions();
        showMessage('Prediction resolved successfully!');
      } else {
        showMessage(data.message || 'Failed to resolve prediction', true);
      }
    } catch (error) {
      console.error('Error resolving prediction:', error);
      showMessage('Error resolving prediction', true);
    }
  };

  const deletePrediction = async (predictionId: string) => {
    if (!confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      const response = await fetch(`/api/predictions/${predictionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        fetchPredictions();
        showMessage('Prediction deleted successfully!');
      } else {
        showMessage(data.message || 'Failed to delete prediction', true);
      }
    } catch (error) {
      console.error('Error deleting prediction:', error);
      showMessage('Error deleting prediction', true);
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="w-8 h-8 text-pink-400" />
              Market Predictions
            </h1>
            <p className="text-gray-400">Make and track your market predictions</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-400" />
              New Prediction
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Symbol */}
              <div>
                <label className="block text-sm font-medium mb-2">Symbol *</label>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {POPULAR_SYMBOLS.map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => handleInputChange('symbol', symbol)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        formData.symbol === symbol
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                  placeholder="Enter symbol (e.g., BTC, ETH)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Direction */}
              <div>
                <label className="block text-sm font-medium mb-2">Direction *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('direction', 'up')}
                    className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                      formData.direction === 'up'
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-gray-700 bg-gray-800 hover:border-green-500/50'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Bullish (Up)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('direction', 'down')}
                    className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
                      formData.direction === 'down'
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-gray-700 bg-gray-800 hover:border-red-500/50'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5" />
                    Bearish (Down)
                  </button>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confidence: {formData.confidence}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.confidence}
                  onChange={(e) => handleInputChange('confidence', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Target Price (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-2">Target Price (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetPrice}
                  onChange={(e) => handleInputChange('targetPrice', e.target.value)}
                  placeholder="Enter expected price"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium mb-2">Timeframe *</label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {TIMEFRAMES.map((timeframe) => (
                    <option key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reasoning */}
              <div>
                <label className="block text-sm font-medium mb-2">Reasoning *</label>
                <textarea
                  value={formData.reasoning}
                  onChange={(e) => handleInputChange('reasoning', e.target.value)}
                  placeholder="Why do you think the price will move in this direction? (Required)"
                  rows={4}
                  maxLength={1000}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {formData.reasoning.length}/1000 characters
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.symbol || !formData.direction || !formData.reasoning.trim()}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Prediction'}
              </button>
            </form>
          </div>

          {/* Recent Predictions */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-6">Your Predictions</h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading predictions...</div>
            ) : predictions.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {predictions.map((prediction) => (
                  <div key={prediction._id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{prediction.symbol}</span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          prediction.direction === 'up' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {prediction.direction === 'up' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {prediction.direction.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs ${
                          prediction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          prediction.status === 'correct' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {prediction.status}
                        </div>
                        {prediction.status === 'pending' && (
                          <button
                            onClick={() => deletePrediction(prediction._id)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-500/10 rounded"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Confidence: {prediction.confidence}/10</div>
                      <div>Timeframe: {getTimeframeLabel(prediction.timeframe)}</div>
                      {prediction.targetPrice && (
                        <div>Target Price: ${prediction.targetPrice.toLocaleString()}</div>
                      )}
                      {prediction.actualPrice && (
                        <div>Actual Price: ${prediction.actualPrice.toLocaleString()}</div>
                      )}
                      {prediction.reasoning && (
                        <div className="mt-2 text-gray-300 text-sm">{prediction.reasoning}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Created: {new Date(prediction.createdAt).toLocaleString()}
                      </div>
                      {prediction.resolvedAt && (
                        <div className="text-xs text-gray-500">
                          Resolved: {new Date(prediction.resolvedAt).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Resolve Prediction (for pending predictions) */}
                    {prediction.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-xs text-gray-400 mb-2">Resolve this prediction:</div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolvePrediction(prediction._id, true)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Mark Correct
                          </button>
                          <button
                            onClick={() => resolvePrediction(prediction._id, false)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Mark Incorrect
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No predictions yet. Make your first prediction!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}