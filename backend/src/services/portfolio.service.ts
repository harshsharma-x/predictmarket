import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import { paginate, formatPaginatedResponse } from '../utils/helpers';

export async function getPortfolioSummary(userId: string) {
  const positions = await prisma.position.findMany({
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

export async function getPositions(userId: string) {
  return prisma.position.findMany({
    where: { userId, shares: { gt: 0 } },
    include: {
      market: { select: { id: true, question: true, status: true, resolutionDate: true } },
      outcome: { select: { label: true, price: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getTradeHistory(userId: string, params: { page: number; limit: number }) {
  const { skip, take } = paginate(params.page, params.limit);

  const [trades, total] = await Promise.all([
    prisma.trade.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        market: { select: { question: true } },
        outcome: { select: { label: true } },
      },
    }),
    prisma.trade.count({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    }),
  ]);

  const enriched = trades.map((t) => ({
    ...t,
    role: t.buyerId === userId ? 'buyer' : 'seller',
  }));

  return formatPaginatedResponse(enriched, total, params.page, params.limit);
}

export async function getPnL(userId: string) {
  const positions = await prisma.position.findMany({
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

export async function claimWinnings(userId: string, marketId: string) {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    include: { outcomes: true },
  });

  if (!market) throw new NotFoundError('Market not found');
  if (market.status !== 'RESOLVED') throw new ValidationError('Market is not resolved');
  if (!market.outcome) throw new ValidationError('Market outcome not set');

  const winningOutcome = market.outcomes.find((o) => o.label === market.outcome);
  if (!winningOutcome) throw new NotFoundError('Winning outcome not found');

  const position = await prisma.position.findUnique({
    where: { userId_marketId_outcomeId: { userId, marketId, outcomeId: winningOutcome.id } },
  });

  if (!position) throw new NotFoundError('No position found for this market');
  if (position.shares <= 0) throw new ValidationError('No shares to claim');

  const winnings = position.shares * 1.0;
  const pnl = winnings - position.shares * position.avgPrice;

  await prisma.position.update({
    where: { id: position.id },
    data: { shares: 0, currentValue: 0, pnl },
  });

  return { winnings, pnl, shares: position.shares };
}
