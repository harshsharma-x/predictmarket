"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceHistory = getPriceHistory;
exports.getMarketStats = getMarketStats;
exports.recordPriceSnapshot = recordPriceSnapshot;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
function getTimeframeStart(timeframe) {
    const now = new Date();
    switch (timeframe) {
        case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
        case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'all': return null;
    }
}
async function getPriceHistory(marketId, outcomeId, timeframe = '24h') {
    const market = await database_1.default.market.findUnique({ where: { id: marketId } });
    if (!market)
        throw new errors_1.NotFoundError('Market not found');
    const since = getTimeframeStart(timeframe);
    const history = await database_1.default.priceHistory.findMany({
        where: {
            marketId,
            outcomeId,
            ...(since && { timestamp: { gte: since } }),
        },
        orderBy: { timestamp: 'asc' },
        select: { price: true, timestamp: true },
    });
    return history;
}
async function getMarketStats(marketId) {
    const market = await database_1.default.market.findUnique({
        where: { id: marketId },
        include: { outcomes: true },
    });
    if (!market)
        throw new errors_1.NotFoundError('Market not found');
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [trades24h, allTrades] = await Promise.all([
        database_1.default.trade.findMany({
            where: { marketId, createdAt: { gte: since24h } },
            select: { price: true, amount: true },
        }),
        database_1.default.trade.aggregate({
            where: { marketId },
            _count: true,
            _sum: { amount: true },
        }),
    ]);
    const volume24h = trades24h.reduce((sum, t) => sum + t.price * t.amount, 0);
    const totalVolume = market.outcomes.reduce((sum, o) => sum + o.totalVolume, 0);
    // Get price change from 24h ago
    const priceHistory24h = {};
    for (const outcome of market.outcomes) {
        const oldPrice = await database_1.default.priceHistory.findFirst({
            where: { marketId, outcomeId: outcome.id, timestamp: { gte: since24h } },
            orderBy: { timestamp: 'asc' },
        });
        priceHistory24h[outcome.id] = {
            open: oldPrice?.price ?? outcome.price,
            current: outcome.price,
        };
    }
    return {
        totalVolume,
        volume24h,
        totalTrades: allTrades._count,
        priceChanges: priceHistory24h,
    };
}
async function recordPriceSnapshot(marketId, outcomeId, price) {
    await database_1.default.priceHistory.create({
        data: { marketId, outcomeId, price },
    });
}
//# sourceMappingURL=price.service.js.map