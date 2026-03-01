import prisma from '../config/database';
import { paginate, formatPaginatedResponse } from '../utils/helpers';

export async function getLeaderboard(params: { page: number; limit: number }) {
  const { skip, take } = paginate(params.page, params.limit);

  const [entries, total] = await Promise.all([
    prisma.leaderboard.findMany({
      skip,
      take,
      orderBy: { totalPnl: 'desc' },
      include: {
        user: { select: { walletAddress: true, username: true, avatar: true } },
      },
    }),
    prisma.leaderboard.count(),
  ]);

  return formatPaginatedResponse(entries, total, params.page, params.limit);
}

export async function getUserRank(userId: string) {
  const entry = await prisma.leaderboard.findUnique({
    where: { userId },
    include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
  });
  return entry;
}

export async function recalculateLeaderboard(): Promise<void> {
  // Get all users with their trade stats
  const users = await prisma.user.findMany({
    include: {
      positions: true,
      buyTrades: true,
    },
  });

  const rankings = users.map((user) => {
    const totalPnl = user.positions.reduce((sum, p) => sum + p.pnl, 0);
    const totalTrades = user.buyTrades.length;
    const profitableTrades = user.buyTrades.filter((t) => {
      const position = user.positions.find(
        (p) => p.marketId === t.marketId && p.outcomeId === t.outcomeId
      );
      return position && position.pnl > 0;
    }).length;
    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

    return { userId: user.id, totalPnl, totalTrades, winRate };
  });

  rankings.sort((a, b) => b.totalPnl - a.totalPnl);

  for (let i = 0; i < rankings.length; i++) {
    const r = rankings[i];
    await prisma.leaderboard.upsert({
      where: { userId: r.userId },
      update: { totalPnl: r.totalPnl, totalTrades: r.totalTrades, winRate: r.winRate, rank: i + 1 },
      create: { userId: r.userId, totalPnl: r.totalPnl, totalTrades: r.totalTrades, winRate: r.winRate, rank: i + 1 },
    });
  }
}
