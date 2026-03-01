import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

type Timeframe = '1h' | '24h' | '7d' | '30d' | 'all';

function getTimeframeStart(timeframe: Timeframe): Date | null {
  const now = new Date();
  switch (timeframe) {
    case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'all': return null;
  }
}

export async function getPriceHistory(marketId: string, outcomeId: string, timeframe: Timeframe = '24h') {
  const market = await prisma.market.findUnique({ where: { id: marketId } });
  if (!market) throw new NotFoundError('Market not found');

  const since = getTimeframeStart(timeframe);

  const history = await prisma.priceHistory.findMany({
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

export async function getMarketStats(marketId: string) {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    include: { outcomes: true },
  });
  if (!market) throw new NotFoundError('Market not found');

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [trades24h, allTrades] = await Promise.all([
    prisma.trade.findMany({
      where: { marketId, createdAt: { gte: since24h } },
      select: { price: true, amount: true },
    }),
    prisma.trade.aggregate({
      where: { marketId },
      _count: true,
      _sum: { amount: true },
    }),
  ]);

  const volume24h = trades24h.reduce((sum, t) => sum + t.price * t.amount, 0);
  const totalVolume = market.outcomes.reduce((sum, o) => sum + o.totalVolume, 0);

  // Get price change from 24h ago
  const priceHistory24h: Record<string, { open: number; current: number }> = {};
  for (const outcome of market.outcomes) {
    const oldPrice = await prisma.priceHistory.findFirst({
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

export async function recordPriceSnapshot(marketId: string, outcomeId: string, price: number): Promise<void> {
  await prisma.priceHistory.create({
    data: { marketId, outcomeId, price },
  });
}
