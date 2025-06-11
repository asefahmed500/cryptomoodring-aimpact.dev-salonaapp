import React, { useState } from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

const ASSETS = ['BTC', 'SOL', 'ETH'];
const TIMEFRAMES = ['24h', '7d', '30d'];

export const PredictionForm: React.FC = () => {
  const [asset, setAsset] = useState('SOL');
  const [prediction, setPrediction] = useState<'bull' | 'bear' | 'sideways'>('bull');
  const [confidence, setConfidence] = useState(7);
  const [timeframe, setTimeframe] = useState('24h');
  const [priceRange, setPriceRange] = useState({ min: 100, max: 150 });
  
  const addPrediction = useStore(state => state.addPrediction);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addPrediction({
      asset,
      prediction,
      confidence,
      priceRange,
      timeframe
    });
    
    // Reset form
    setConfidence(7);
    setPriceRange({ min: 100, max: 150 });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-semibold">Make a Prediction</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Asset:</label>
          <div className="flex space-x-2">
            {ASSETS.map(assetOption => (
              <button
                key={assetOption}
                type="button"
                onClick={() => setAsset(assetOption)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  asset === assetOption
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {assetOption}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Direction */}
        <div>
          <label className="block text-sm font-medium mb-2">Direction:</label>
          <div className="flex space-x-2">
            {(['bull', 'bear', 'sideways'] as const).map(dir => (
              <button
                key={dir}
                type="button"
                onClick={() => setPrediction(dir)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  prediction === dir
                    ? dir === 'bull' ? 'bg-green-600' : dir === 'bear' ? 'bg-red-600' : 'bg-yellow-600'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } text-white`}
              >
                {dir === 'bull' ? '🐂 Bull' : dir === 'bear' ? '🐻 Bear' : '➡️ Sideways'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-medium mb-2">Timeframe:</label>
          <div className="flex space-x-2">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Confidence: {confidence}/10
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

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Price ($):</label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Price ($):</label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-colors font-medium"
        >
          Submit Prediction
        </button>
      </form>
    </div>
  );
};
