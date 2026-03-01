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
export declare function calculatePrice(yesShares: number, noShares: number): PriceResult;
/**
 * Calculate shares out for a given amount in (constant product AMM)
 * Using x * y = k formula
 */
export declare function calculateSharesOut(amountIn: number, reserveIn: number, reserveOut: number): number;
/**
 * Calculate cost of buying shares using a linear price approximation
 * (trapezoidal integration between currentPrice and targetPrice).
 * This is a simplified model; a full LMSR integral would be more precise.
 */
export declare function calculateCost(shares: number, currentPrice: number, targetPrice: number): number;
/**
 * Calculate price impact percentage
 */
export declare function getImpact(amount: number, totalShares: number): number;
/**
 * Calculate new price after a trade
 */
export declare function calculateNewPrice(currentPrice: number, amount: number, totalLiquidity: number, side: 'BUY' | 'SELL'): number;
//# sourceMappingURL=amm.d.ts.map