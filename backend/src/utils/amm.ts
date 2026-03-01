/**
 * AMM (Automated Market Maker) utilities using LMSR/constant product formulas
 */

export interface PriceResult {
  yesPrice: number;
  noPrice: number;
}

/**
 * Calculate prices using constant product formula
 * yesPrice = noShares / (yesShares + noShares)
 */
export function calculatePrice(yesShares: number, noShares: number): PriceResult {
  const total = yesShares + noShares;
  if (total === 0) {
    return { yesPrice: 0.5, noPrice: 0.5 };
  }
  const yesPrice = noShares / total;
  const noPrice = yesShares / total;
  return {
    yesPrice: Math.min(Math.max(yesPrice, 0.01), 0.99),
    noPrice: Math.min(Math.max(noPrice, 0.01), 0.99),
  };
}

/**
 * Calculate shares out for a given amount in (constant product AMM)
 * Using x * y = k formula
 */
export function calculateSharesOut(
  amountIn: number,
  reserveIn: number,
  reserveOut: number
): number {
  if (reserveIn <= 0 || reserveOut <= 0 || amountIn <= 0) return 0;
  const k = reserveIn * reserveOut;
  const newReserveIn = reserveIn + amountIn;
  const newReserveOut = k / newReserveIn;
  return reserveOut - newReserveOut;
}

/**
 * Calculate cost of buying shares using a linear price approximation
 * (trapezoidal integration between currentPrice and targetPrice).
 * This is a simplified model; a full LMSR integral would be more precise.
 */
export function calculateCost(
  shares: number,
  currentPrice: number,
  targetPrice: number
): number {
  if (shares <= 0) return 0;
  const avgPrice = (currentPrice + targetPrice) / 2;
  return shares * avgPrice;
}

/**
 * Calculate price impact percentage
 */
export function getImpact(amount: number, totalShares: number): number {
  if (totalShares <= 0) return 100;
  const impact = (amount / (totalShares + amount)) * 100;
  return Math.min(impact, 100);
}

/**
 * Calculate new price after a trade
 */
export function calculateNewPrice(
  currentPrice: number,
  amount: number,
  totalLiquidity: number,
  side: 'BUY' | 'SELL'
): number {
  const impact = getImpact(amount, totalLiquidity) / 100;
  const priceChange = impact * 0.1;
  const newPrice =
    side === 'BUY'
      ? currentPrice + priceChange * (1 - currentPrice)
      : currentPrice - priceChange * currentPrice;
  return Math.min(Math.max(newPrice, 0.01), 0.99);
}
