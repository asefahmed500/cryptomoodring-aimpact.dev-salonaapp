import React from 'react';

interface EmotionTagsProps {
  selectedEmotions: string[];
  onChange: (emotions: string[]) => void;
  disabled?: boolean;
}

const emotionOptions = [
  'Happy', 'Excited', 'Confident', 'Optimistic', 
  'Neutral', 'Uncertain', 'Anxious', 'Fearful',
  'Frustrated', 'Angry', 'Stressed', 'Pessimistic'
];

export const EmotionTags: React.FC<EmotionTagsProps> = ({ 
  selectedEmotions, 
  onChange, 
  disabled = false 
}) => {
  const handleTagClick = (emotion: string) => {
    if (disabled) return;
    
    const newSelection = selectedEmotions.includes(emotion)
      ? selectedEmotions.filter(e => e !== emotion)
      : [...selectedEmotions, emotion];
    
    onChange(newSelection);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      'Happy': 'bg-green-100 text-green-800',
      'Excited': 'bg-purple-100 text-purple-800',
      'Confident': 'bg-blue-100 text-blue-800',
      'Optimistic': 'bg-teal-100 text-teal-800',
      'Neutral': 'bg-gray-100 text-gray-800',
      'Uncertain': 'bg-yellow-100 text-yellow-800',
      'Anxious': 'bg-orange-100 text-orange-800',
      'Fearful': 'bg-red-100 text-red-800',
      'Frustrated': 'bg-amber-100 text-amber-800',
      'Angry': 'bg-red-100 text-red-800',
      'Stressed': 'bg-rose-100 text-rose-800',
      'Pessimistic': 'bg-indigo-100 text-indigo-800'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Emotions (Max 3)
      </label>
      <div className="flex flex-wrap gap-2">
        {emotionOptions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion);
          const isDisabled = disabled || (!isSelected && selectedEmotions.length >= 3);

          return (
            <button
              key={emotion}
              type="button"
              disabled={isDisabled}
              onClick={() => handleTagClick(emotion)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all 
                ${getEmotionColor(emotion)}
                ${isSelected 
                  ? 'ring-2 ring-offset-1 ring-opacity-50' 
                  : 'opacity-70 hover:opacity-100'}
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'}`}
            >
              {emotion}
            </button>
          );
        })}
      </div>
      {selectedEmotions.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Selected: {selectedEmotions.join(', ')}
        </p>
      )}
    </div>
  );
};
export default EmotionTags;