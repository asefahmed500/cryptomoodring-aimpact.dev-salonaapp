export async function getMarketData() {
  try {
    // Simulate market data - in production, use real APIs like CoinGecko
    const btcPrice = 42000 + Math.random() * 5000;
    const solPrice = 80 + Math.random() * 20;
    const fearGreedIndex = Math.floor(Math.random() * 100);

    return {
      btcPrice: Math.round(btcPrice),
      solPrice: Math.round(solPrice * 100) / 100,
      fearGreedIndex
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      btcPrice: 45000,
      solPrice: 90,
      fearGreedIndex: 50
    };
  }
}

export function getFearGreedLabel(index: number): string {
  if (index >= 75) return 'Extreme Greed';
  if (index >= 55) return 'Greed';
  if (index >= 45) return 'Neutral';
  if (index >= 25) return 'Fear';
  return 'Extreme Fear';
}
