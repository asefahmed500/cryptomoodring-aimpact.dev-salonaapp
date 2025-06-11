export interface MoodAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  suggestedEmotions: string[];
  marketAlignment: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
}

export function analyzeMood(
  moodScore: number,
  emotions: string[],
  notes: string,
  marketContext: any
): MoodAnalysis {
  // Simple AI analysis simulation
  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let confidence = 0.5;
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';

  // Analyze mood score
  if (moodScore >= 7) {
    sentiment = 'bullish';
    confidence += 0.2;
  } else if (moodScore <= 4) {
    sentiment = 'bearish';
    confidence += 0.2;
  }

  // Analyze emotions
  const bullishEmotions = ['Diamond Hands', 'Optimistic', 'Bullish', 'Excited', 'Confident'];
  const bearishEmotions = ['Paper Hands', 'FUD', 'Bearish', 'Anxious', 'Uncertain'];

  const bullishCount = emotions.filter(e => bullishEmotions.includes(e)).length;
  const bearishCount = emotions.filter(e => bearishEmotions.includes(e)).length;

  if (bullishCount > bearishCount) {
    sentiment = 'bullish';
    confidence += 0.15;
  } else if (bearishCount > bullishCount) {
    sentiment = 'bearish';
    confidence += 0.15;
  }

  // Analyze market context
  const fearGreed = marketContext.fearGreedIndex;
  if (fearGreed > 70) {
    riskLevel = 'high';
    confidence += 0.1;
  } else if (fearGreed < 30) {
    riskLevel = 'high';
    confidence += 0.1;
  } else {
    riskLevel = 'low';
  }

  // Market alignment
  let marketAlignment = 0.5;
  if (sentiment === 'bullish' && fearGreed > 50) marketAlignment = 0.8;
  if (sentiment === 'bearish' && fearGreed < 50) marketAlignment = 0.8;

  // Generate suggestions
  const suggestedEmotions = sentiment === 'bullish' 
    ? ['Optimistic', 'Confident', 'Diamond Hands']
    : ['Cautious', 'Analytical', 'Patient'];

  // Generate recommendation
  let recommendation = '';
  if (sentiment === 'bullish' && riskLevel === 'low') {
    recommendation = 'Your mood aligns well with market conditions. Consider gradual position building.';
  } else if (sentiment === 'bearish' && riskLevel === 'high') {
    recommendation = 'Your caution matches market volatility. Consider risk management strategies.';
  } else {
    recommendation = 'Mixed signals detected. Consider waiting for clearer market direction.';
  }

  return {
    sentiment,
    confidence: Math.min(confidence, 1),
    suggestedEmotions,
    marketAlignment,
    riskLevel,
    recommendation
  };
}
