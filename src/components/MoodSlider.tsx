import React from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange, disabled = false }) => {
  const getMoodEmoji = (score: number) => {
    if (score >= 9) return '🚀';
    if (score >= 8) return '😄';
    if (score >= 7) return '😊';
    if (score >= 6) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 4) return '😕';
    if (score >= 3) return '😟';
    if (score >= 2) return '😰';
    return '😱';
  };

  const getMoodLabel = (score: number) => {
    if (score >= 9) return 'Moon Bound!';
    if (score >= 8) return 'Diamond Hands';
    if (score >= 7) return 'Bullish';
    if (score >= 6) return 'Optimistic';
    if (score >= 5) return 'Neutral';
    if (score >= 4) return 'Cautious';
    if (score >= 3) return 'Bearish';
    if (score >= 2) return 'Paper Hands';
    return 'Rekt';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{getMoodEmoji(value)}</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{value}/10</div>
          <div className="text-sm text-gray-400">{getMoodLabel(value)}</div>
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MoodSlider;
