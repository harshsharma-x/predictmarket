"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioSummary = getPortfolioSummary;
exports.getPositions = getPositions;
exports.getTradeHistory = getTradeHistory;
exports.getPnL = getPnL;
exports.claimWinnings = claimWinnings;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
async function getPortfolioSummary(userId) {
    const positions = await database_1.default.position.findMany({
        where: { userId, shares: { gt: 0 } },
        include: { outcome: true, market: { select: { status: true } } },
    });
    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvested = positions.reduce((sum, p) => sum + p.shares * p.avgPrice, 0);
    const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
    const activePositions = positions.filter((p) => p.market.status === 'ACTIVE').length;
    return {
        totalValue,
        totalInvested,
        totalPnl,
        pnlPercentage: totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0,
        activePositions,
        totalPositions: positions.length,
    };
}
async function getPositions(userId) {
    return database_1.default.position.findMany({
        where: { userId, shares: { gt: 0 } },
        include: {
            market: { select: { id: true, question: true, status: true, resolutionDate: true } },
            outcome: { select: { label: true, price: true } },
        },
        orderBy: { updatedAt: 'desc' },
    });
}
async function getTradeHistory(userId, params) {
    const { skip, take } = (0, helpers_1.paginate)(params.page, params.limit);
    const [trades, total] = await Promise.all([
        database_1.default.trade.findMany({
            where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                market: { select: { question: true } },
                outcome: { select: { label: true } },
            },
        }),
        database_1.default.trade.count({
            where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
        }),
    ]);
    const enriched = trades.map((t) => ({
        ...t,
        role: t.buyerId === userId ? 'buyer' : 'seller',
    }));
    return (0, helpers_1.formatPaginatedResponse)(enriched, total, params.page, params.limit);
}
async function getPnL(userId) {
    const positions = await database_1.default.position.findMany({
        where: { userId },
        include: {
            market: { select: { id: true, question: true, status: true, outcome: true } },
            outcome: { select: { label: true, price: true } },
        },
    });
    return positions.map((p) => ({
        marketId: p.marketId,
        marketQuestion: p.market.question,
        marketStatus: p.market.status,
        outcomeLabel: p.outcome.label,
        shares: p.shares,
        avgPrice: p.avgPrice,
        currentPrice: p.outcome.price,
        currentValue: p.currentValue,
        invested: p.shares * p.avgPrice,
        pnl: p.pnl,
        pnlPercentage: p.avgPrice > 0 ? ((p.outcome.price - p.avgPrice) / p.avgPrice) * 100 : 0,
    }));
}
async function claimWinnings(userId, marketId) {
    const market = await database_1.default.market.findUnique({
        where: { id: marketId },
        include: { outcomes: true },
    });
    if (!market)
        throw new errors_1.NotFoundError('Market not found');
    if (market.status !== 'RESOLVED')
        throw new errors_1.ValidationError('Market is not resolved');
    if (!market.outcome)
        throw new errors_1.ValidationError('Market outcome not set');
    const winningOutcome = market.outcomes.find((o) => o.label === market.outcome);
    if (!winningOutcome)
        throw new errors_1.NotFoundError('Winning outcome not found');
    const position = await database_1.default.position.findUnique({
        where: { userId_marketId_outcomeId: { userId, marketId, outcomeId: winningOutcome.id } },
    });
    if (!position)
        throw new errors_1.NotFoundError('No position found for this market');
    if (position.shares <= 0)
        throw new errors_1.ValidationError('No shares to claim');
    const winnings = position.shares * 1.0;
    const pnl = winnings - position.shares * position.avgPrice;
    await database_1.default.position.update({
        where: { id: position.id },
        data: { shares: 0, currentValue: 0, pnl },
    });
    return { winnings, pnl, shares: position.shares };
}
//# sourceMappingURL=portfolio.service.js.map