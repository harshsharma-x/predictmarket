import prisma from '../config/database';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors';
import { paginate, formatPaginatedResponse } from '../utils/helpers';
import { CreateOrderInput } from '../validators/order.validator';
import { matchOrder } from './matching.service';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export async function createOrder(userId: string, data: CreateOrderInput) {
  const market = await prisma.market.findUnique({
    where: { id: data.marketId },
    include: { outcomes: true },
  });

  if (!market) throw new NotFoundError('Market not found');
  if (market.status !== 'ACTIVE') throw new ValidationError('Market is not active');

  const outcome = market.outcomes.find((o) => o.id === data.outcomeId);
  if (!outcome) throw new NotFoundError('Outcome not found');

  const price = data.type === 'MARKET' ? outcome.price : (data.price ?? outcome.price);

  const order = await prisma.order.create({
    data: {
      userId,
      marketId: data.marketId,
      outcomeId: data.outcomeId,
      side: data.side,
      type: data.type,
      price,
      amount: data.amount,
      filled: 0,
      remaining: data.amount,
      status: 'OPEN',
    },
    include: { outcome: true, market: { select: { question: true } } },
  });

  // Trigger matching engine asynchronously
  matchOrder(order).catch((err) => {
    logger.error({ err }, 'Matching engine error');
  });

  return order;
}

export async function getUserOrders(userId: string, filters: { status?: string; page: number; limit: number }) {
  const { skip, take } = paginate(filters.page, filters.limit);

  const where: Prisma.OrderWhereInput = { userId };
  if (filters.status) {
    where.status = filters.status as Prisma.EnumOrderStatusFilter;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        market: { select: { question: true, status: true } },
        outcome: { select: { label: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return formatPaginatedResponse(orders, total, filters.page, filters.limit);
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      market: { select: { question: true } },
      outcome: { select: { label: true } },
      user: { select: { walletAddress: true, username: true } },
    },
  });

  if (!order) throw new NotFoundError('Order not found');
  return order;
}

export async function cancelOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError('Order not found');
  if (order.userId !== userId) throw new ForbiddenError('Not your order');
  if (!['OPEN', 'PARTIALLY_FILLED'].includes(order.status)) {
    throw new ValidationError('Order cannot be cancelled');
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  });
}

export async function getOrderBook(marketId: string) {
  const orders = await prisma.order.findMany({
    where: { marketId, status: { in: ['OPEN', 'PARTIALLY_FILLED'] } },
    select: { side: true, price: true, remaining: true, outcomeId: true },
    orderBy: { price: 'asc' },
  });

  const groupByOutcome: Record<string, { bids: Record<string, number>; asks: Record<string, number> }> = {};

  for (const order of orders) {
    if (!groupByOutcome[order.outcomeId]) {
      groupByOutcome[order.outcomeId] = { bids: {}, asks: {} };
    }
    const key = order.price.toFixed(4);
    if (order.side === 'BUY') {
      groupByOutcome[order.outcomeId].bids[key] = (groupByOutcome[order.outcomeId].bids[key] || 0) + order.remaining;
    } else {
      groupByOutcome[order.outcomeId].asks[key] = (groupByOutcome[order.outcomeId].asks[key] || 0) + order.remaining;
    }
  }

  const result: Record<string, { bids: Array<{ price: number; amount: number }>; asks: Array<{ price: number; amount: number }> }> = {};

  for (const [outcomeId, book] of Object.entries(groupByOutcome)) {
    result[outcomeId] = {
      bids: Object.entries(book.bids).map(([p, a]) => ({ price: parseFloat(p), amount: a })).sort((a, b) => b.price - a.price),
      asks: Object.entries(book.asks).map(([p, a]) => ({ price: parseFloat(p), amount: a })).sort((a, b) => a.price - b.price),
    };
  }

  return result;
}

export async function getMarketTrades(marketId: string, limit = 50) {
  return prisma.trade.findMany({
    where: { marketId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      outcome: { select: { label: true } },
      buyer: { select: { walletAddress: true, username: true } },
    },
  });
}
