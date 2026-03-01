"use strict";
/**
 * AMM (Automated Market Maker) utilities using LMSR/constant product formulas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = calculatePrice;
exports.calculateSharesOut = calculateSharesOut;
exports.calculateCost = calculateCost;
exports.getImpact = getImpact;
exports.calculateNewPrice = calculateNewPrice;
/**
 * Calculate prices using constant product formula
 * yesPrice = noShares / (yesShares + noShares)
 */
function calculatePrice(yesShares, noShares) {
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
function calculateSharesOut(amountIn, reserveIn, reserveOut) {
    if (reserveIn <= 0 || reserveOut <= 0 || amountIn <= 0)
        return 0;
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
function calculateCost(shares, currentPrice, targetPrice) {
    if (shares <= 0)
        return 0;
    const avgPrice = (currentPrice + targetPrice) / 2;
    return shares * avgPrice;
}
/**
 * Calculate price impact percentage
 */
function getImpact(amount, totalShares) {
    if (totalShares <= 0)
        return 100;
    const impact = (amount / (totalShares + amount)) * 100;
    return Math.min(impact, 100);
}
/**
 * Calculate new price after a trade
 */
function calculateNewPrice(currentPrice, amount, totalLiquidity, side) {
    const impact = getImpact(amount, totalLiquidity) / 100;
    const priceChange = impact * 0.1;
    const newPrice = side === 'BUY'
        ? currentPrice + priceChange * (1 - currentPrice)
        : currentPrice - priceChange * currentPrice;
    return Math.min(Math.max(newPrice, 0.01), 0.99);
}
//# sourceMappingURL=amm.js.map