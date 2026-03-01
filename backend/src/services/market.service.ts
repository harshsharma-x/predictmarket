import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import { paginate, formatPaginatedResponse } from '../utils/helpers';
import { CreateMarketInput, UpdateMarketInput, ListMarketsInput } from '../validators/market.validator';
import { Prisma } from '@prisma/client';

export async function listMarkets(params: ListMarketsInput) {
  const { page, limit, category, status, sort, search, featured } = params;
  const { skip, take } = paginate(page, limit);

  const where: Prisma.MarketWhereInput = {};
  if (category) where.category = category;
  if (status) where.status = status as Prisma.EnumMarketStatusFilter;
  if (featured) where.featured = true;
  if (search) {
    where.OR = [
      { question: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.MarketOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'oldest': return { createdAt: 'asc' };
      case 'closing_soon': return { resolutionDate: 'asc' };
      case 'featured': return { featured: 'desc' };
      default: return { createdAt: 'desc' };
    }
  })();

  const [markets, total] = await Promise.all([
    prisma.market.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        outcomes: true,
        _count: { select: { trades: true } },
      },
    }),
    prisma.market.count({ where }),
  ]);

  const enriched = markets.map((m) => ({
    ...m,
    totalVolume: m.outcomes.reduce((sum, o) => sum + o.totalVolume, 0),
    totalTrades: m._count.trades,
  }));

  return formatPaginatedResponse(enriched, total, page, limit);
}

export async function getFeaturedMarkets() {
  return prisma.market.findMany({
    where: { featured: true, status: 'ACTIVE' },
    include: { outcomes: true },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCategories() {
  const result = await prisma.market.groupBy({
    by: ['category'],
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } },
  });
  return result.map((r) => ({ category: r.category, count: r._count.category }));
}

export async function getMarketById(id: string) {
  const market = await prisma.market.findUnique({
    where: { id },
    include: {
      outcomes: true,
      trades: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { buyer: { select: { walletAddress: true, username: true } } },
      },
      _count: { select: { trades: true, comments: true } },
    },
  });

  if (!market) throw new NotFoundError('Market not found');

  const orderBook = await getOrderBookSummary(id);

  return {
    ...market,
    totalVolume: market.outcomes.reduce((sum, o) => sum + o.totalVolume, 0),
    totalTrades: market._count.trades,
    totalComments: market._count.comments,
    orderBook,
  };
}

async function getOrderBookSummary(marketId: string) {
  const orders = await prisma.order.findMany({
    where: { marketId, status: { in: ['OPEN', 'PARTIALLY_FILLED'] } },
    select: { side: true, price: true, remaining: true, outcomeId: true },
  });

  const bids = orders
    .filter((o) => o.side === 'BUY')
    .reduce<Record<string, number>>((acc, o) => {
      const key = o.price.toFixed(2);
      acc[key] = (acc[key] || 0) + o.remaining;
      return acc;
    }, {});

  const asks = orders
    .filter((o) => o.side === 'SELL')
    .reduce<Record<string, number>>((acc, o) => {
      const key = o.price.toFixed(2);
      acc[key] = (acc[key] || 0) + o.remaining;
      return acc;
    }, {});

  return {
    bids: Object.entries(bids).map(([price, amount]) => ({ price: parseFloat(price), amount })).sort((a, b) => b.price - a.price),
    asks: Object.entries(asks).map(([price, amount]) => ({ price: parseFloat(price), amount })).sort((a, b) => a.price - b.price),
  };
}

export async function createMarket(data: CreateMarketInput) {
  return prisma.market.create({
    data: {
      question: data.question,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      resolutionSource: data.resolutionSource,
      resolutionDate: new Date(data.resolutionDate),
      featured: data.featured ?? false,
      contractAddress: data.contractAddress,
      outcomes: {
        create: [
          { label: 'YES', price: 0.5, totalShares: 1000, totalVolume: 0 },
          { label: 'NO', price: 0.5, totalShares: 1000, totalVolume: 0 },
        ],
      },
    },
    include: { outcomes: true },
  });
}

export async function updateMarket(id: string, data: UpdateMarketInput) {
  const market = await prisma.market.findUnique({ where: { id } });
  if (!market) throw new NotFoundError('Market not found');

  return prisma.market.update({
    where: { id },
    data: {
      ...(data.question && { question: data.question }),
      ...(data.description && { description: data.description }),
      ...(data.category && { category: data.category }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.resolutionSource !== undefined && { resolutionSource: data.resolutionSource }),
      ...(data.resolutionDate && { resolutionDate: new Date(data.resolutionDate) }),
      ...(data.status && { status: data.status as Prisma.EnumMarketStatusFilter }),
      ...(data.featured !== undefined && { featured: data.featured }),
    },
    include: { outcomes: true },
  });
}

export async function resolveMarket(id: string, outcome: 'YES' | 'NO') {
  const market = await prisma.market.findUnique({
    where: { id },
    include: { outcomes: true },
  });
  if (!market) throw new NotFoundError('Market not found');

  const winningOutcome = market.outcomes.find((o) => o.label === outcome);
  const losingOutcome = market.outcomes.find((o) => o.label !== outcome);

  if (!winningOutcome || !losingOutcome) throw new Error('Outcomes not found');

  return prisma.$transaction(async (tx) => {
    // Update market status
    const resolved = await tx.market.update({
      where: { id },
      data: { status: 'RESOLVED', outcome, resolvedAt: new Date() },
      include: { outcomes: true },
    });

    // Update outcome prices
    await tx.outcome.update({ where: { id: winningOutcome.id }, data: { price: 1.0 } });
    await tx.outcome.update({ where: { id: losingOutcome.id }, data: { price: 0.0 } });

    // Cancel open orders
    await tx.order.updateMany({
      where: { marketId: id, status: { in: ['OPEN', 'PARTIALLY_FILLED'] } },
      data: { status: 'CANCELLED' },
    });

    // Update positions - winning positions get full value, losing get zero
    const positions = await tx.position.findMany({ where: { marketId: id } });
    for (const pos of positions) {
      const isWinner = pos.outcomeId === winningOutcome.id;
      const currentValue = isWinner ? pos.shares * 1.0 : 0;
      const pnl = currentValue - pos.shares * pos.avgPrice;
      await tx.position.update({
        where: { id: pos.id },
        data: { currentValue, pnl },
      });
    }

    return resolved;
  });
}
