"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = getLeaderboard;
exports.getUserRank = getUserRank;
exports.recalculateLeaderboard = recalculateLeaderboard;
const database_1 = __importDefault(require("../config/database"));
const helpers_1 = require("../utils/helpers");
async function getLeaderboard(params) {
    const { skip, take } = (0, helpers_1.paginate)(params.page, params.limit);
    const [entries, total] = await Promise.all([
        database_1.default.leaderboard.findMany({
            skip,
            take,
            orderBy: { totalPnl: 'desc' },
            include: {
                user: { select: { walletAddress: true, username: true, avatar: true } },
            },
        }),
        database_1.default.leaderboard.count(),
    ]);
    return (0, helpers_1.formatPaginatedResponse)(entries, total, params.page, params.limit);
}
async function getUserRank(userId) {
    const entry = await database_1.default.leaderboard.findUnique({
        where: { userId },
        include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
    });
    return entry;
}
async function recalculateLeaderboard() {
    // Get all users with their trade stats
    const users = await database_1.default.user.findMany({
        include: {
            positions: true,
            buyTrades: true,
        },
    });
    const rankings = users.map((user) => {
        const totalPnl = user.positions.reduce((sum, p) => sum + p.pnl, 0);
        const totalTrades = user.buyTrades.length;
        const profitableTrades = user.buyTrades.filter((t) => {
            const position = user.positions.find((p) => p.marketId === t.marketId && p.outcomeId === t.outcomeId);
            return position && position.pnl > 0;
        }).length;
        const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
        return { userId: user.id, totalPnl, totalTrades, winRate };
    });
    rankings.sort((a, b) => b.totalPnl - a.totalPnl);
    for (let i = 0; i < rankings.length; i++) {
        const r = rankings[i];
        await database_1.default.leaderboard.upsert({
            where: { userId: r.userId },
            update: { totalPnl: r.totalPnl, totalTrades: r.totalTrades, winRate: r.winRate, rank: i + 1 },
            create: { userId: r.userId, totalPnl: r.totalPnl, totalTrades: r.totalTrades, winRate: r.winRate, rank: i + 1 },
        });
    }
}
//# sourceMappingURL=leaderboard.service.js.map