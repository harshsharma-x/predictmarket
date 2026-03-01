import prisma from '../config/database';
import { Order, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { emitNewTrade, emitOrderBookUpdate } from './websocket.service';
import { getOrderBook } from './order.service';

export async function matchOrder(order: Order): Promise<void> {
  const opposingSide = order.side === 'BUY' ? 'SELL' : 'BUY';

  const whereClause: Prisma.OrderWhereInput = {
    marketId: order.marketId,
    outcomeId: order.outcomeId,
    side: opposingSide,
    status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
    userId: { not: order.userId },
  };

  if (order.type === 'LIMIT') {
    if (order.side === 'BUY') {
      whereClause.price = { lte: order.price };
    } else {
      whereClause.price = { gte: order.price };
    }
  }

  const matchingOrders = await prisma.order.findMany({
    where: whereClause,
    orderBy: [
      { price: order.side === 'BUY' ? 'asc' : 'desc' },
      { createdAt: 'asc' },
    ],
  });

  let remainingAmount = order.remaining;

  for (const matchingOrder of matchingOrders) {
    if (remainingAmount <= 0) break;

    const tradeAmount = Math.min(remainingAmount, matchingOrder.remaining);
    const tradePrice = matchingOrder.price;

    await executeTrade(
      order.side === 'BUY' ? order : matchingOrder,
      order.side === 'SELL' ? order : matchingOrder,
      tradePrice,
      tradeAmount
    );

    remainingAmount -= tradeAmount;

    // Reload order to get updated remaining
    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    if (!updatedOrder || updatedOrder.status === 'FILLED') break;
  }

  // Emit order book update
  try {
    const orderBook = await getOrderBook(order.marketId);
    emitOrderBookUpdate(order.marketId, orderBook);
  } catch (err) {
    logger.error({ err }, 'Failed to emit order book update');
  }
}

export async function executeTrade(
  buyOrder: Order,
  sellOrder: Order,
  price: number,
  amount: number
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Create trade record
    const trade = await tx.trade.create({
      data: {
        marketId: buyOrder.marketId,
        outcomeId: buyOrder.outcomeId,
        buyerId: buyOrder.userId,
        sellerId: sellOrder.userId,
        price,
        amount,
      },
    });

    // Update buy order
    const buyFilled = buyOrder.filled + amount;
    const buyRemaining = buyOrder.amount - buyFilled;
    await tx.order.update({
      where: { id: buyOrder.id },
      data: {
        filled: buyFilled,
        remaining: buyRemaining,
        status: buyRemaining <= 0 ? 'FILLED' : 'PARTIALLY_FILLED',
      },
    });

    // Update sell order
    const sellFilled = sellOrder.filled + amount;
    const sellRemaining = sellOrder.amount - sellFilled;
    await tx.order.update({
      where: { id: sellOrder.id },
      data: {
        filled: sellFilled,
        remaining: sellRemaining,
        status: sellRemaining <= 0 ? 'FILLED' : 'PARTIALLY_FILLED',
      },
    });

    // Update outcome volume and shares
    await tx.outcome.update({
      where: { id: buyOrder.outcomeId },
      data: {
        totalVolume: { increment: price * amount },
        totalShares: { increment: amount },
        price,
      },
    });

    // Update positions
    await updatePosition(tx, buyOrder.userId, buyOrder.marketId, buyOrder.outcomeId, amount, price, 'BUY');
    await updatePosition(tx, sellOrder.userId, sellOrder.marketId, sellOrder.outcomeId, amount, price, 'SELL');

    // Emit trade event
    try {
      emitNewTrade({ ...trade });
    } catch (err) {
      logger.error({ err }, 'Failed to emit trade event');
    }
  });
}

async function updatePosition(
  tx: Prisma.TransactionClient,
  userId: string,
  marketId: string,
  outcomeId: string,
  shares: number,
  price: number,
  side: 'BUY' | 'SELL'
): Promise<void> {
  const existing = await tx.position.findUnique({
    where: { userId_marketId_outcomeId: { userId, marketId, outcomeId } },
  });

  if (!existing) {
    if (side === 'BUY') {
      await tx.position.create({
        data: {
          userId,
          marketId,
          outcomeId,
          shares,
          avgPrice: price,
          currentValue: shares * price,
          pnl: 0,
        },
      });
    }
    return;
  }

  if (side === 'BUY') {
    const totalShares = existing.shares + shares;
    const totalCost = existing.shares * existing.avgPrice + shares * price;
    const avgPrice = totalCost / totalShares;
    const currentValue = totalShares * price;
    const pnl = currentValue - totalCost;
    await tx.position.update({
      where: { id: existing.id },
      data: { shares: totalShares, avgPrice, currentValue, pnl },
    });
  } else {
    const newShares = existing.shares - shares;
    if (newShares <= 0) {
      const pnl = existing.pnl + (price - existing.avgPrice) * shares;
      await tx.position.update({
        where: { id: existing.id },
        data: { shares: 0, currentValue: 0, pnl },
      });
    } else {
      const pnl = existing.pnl + (price - existing.avgPrice) * shares;
      const currentValue = newShares * price;
      await tx.position.update({
        where: { id: existing.id },
        data: { shares: newShares, currentValue, pnl },
      });
    }
  }
}
