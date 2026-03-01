"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getOrderById = getOrderById;
exports.cancelOrder = cancelOrder;
exports.getOrderBook = getOrderBook;
exports.getMarketTrades = getMarketTrades;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const matching_service_1 = require("./matching.service");
async function createOrder(userId, data) {
    const market = await database_1.default.market.findUnique({
        where: { id: data.marketId },
        include: { outcomes: true },
    });
    if (!market)
        throw new errors_1.NotFoundError('Market not found');
    if (market.status !== 'ACTIVE')
        throw new errors_1.ValidationError('Market is not active');
    const outcome = market.outcomes.find((o) => o.id === data.outcomeId);
    if (!outcome)
        throw new errors_1.NotFoundError('Outcome not found');
    const price = data.type === 'MARKET' ? outcome.price : (data.price ?? outcome.price);
    const order = await database_1.default.order.create({
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
    (0, matching_service_1.matchOrder)(order).catch((err) => {
        console.error('Matching engine error:', err);
    });
    return order;
}
async function getUserOrders(userId, filters) {
    const { skip, take } = (0, helpers_1.paginate)(filters.page, filters.limit);
    const where = { userId };
    if (filters.status) {
        where.status = filters.status;
    }
    const [orders, total] = await Promise.all([
        database_1.default.order.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                market: { select: { question: true, status: true } },
                outcome: { select: { label: true } },
            },
        }),
        database_1.default.order.count({ where }),
    ]);
    return (0, helpers_1.formatPaginatedResponse)(orders, total, filters.page, filters.limit);
}
async function getOrderById(id) {
    const order = await database_1.default.order.findUnique({
        where: { id },
        include: {
            market: { select: { question: true } },
            outcome: { select: { label: true } },
            user: { select: { walletAddress: true, username: true } },
        },
    });
    if (!order)
        throw new errors_1.NotFoundError('Order not found');
    return order;
}
async function cancelOrder(userId, orderId) {
    const order = await database_1.default.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new errors_1.NotFoundError('Order not found');
    if (order.userId !== userId)
        throw new errors_1.ForbiddenError('Not your order');
    if (!['OPEN', 'PARTIALLY_FILLED'].includes(order.status)) {
        throw new errors_1.ValidationError('Order cannot be cancelled');
    }
    return database_1.default.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
    });
}
async function getOrderBook(marketId) {
    const orders = await database_1.default.order.findMany({
        where: { marketId, status: { in: ['OPEN', 'PARTIALLY_FILLED'] } },
        select: { side: true, price: true, remaining: true, outcomeId: true },
        orderBy: { price: 'asc' },
    });
    const groupByOutcome = {};
    for (const order of orders) {
        if (!groupByOutcome[order.outcomeId]) {
            groupByOutcome[order.outcomeId] = { bids: {}, asks: {} };
        }
        const key = order.price.toFixed(4);
        if (order.side === 'BUY') {
            groupByOutcome[order.outcomeId].bids[key] = (groupByOutcome[order.outcomeId].bids[key] || 0) + order.remaining;
        }
        else {
            groupByOutcome[order.outcomeId].asks[key] = (groupByOutcome[order.outcomeId].asks[key] || 0) + order.remaining;
        }
    }
    const result = {};
    for (const [outcomeId, book] of Object.entries(groupByOutcome)) {
        result[outcomeId] = {
            bids: Object.entries(book.bids).map(([p, a]) => ({ price: parseFloat(p), amount: a })).sort((a, b) => b.price - a.price),
            asks: Object.entries(book.asks).map(([p, a]) => ({ price: parseFloat(p), amount: a })).sort((a, b) => a.price - b.price),
        };
    }
    return result;
}
async function getMarketTrades(marketId, limit = 50) {
    return database_1.default.trade.findMany({
        where: { marketId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            outcome: { select: { label: true } },
            buyer: { select: { walletAddress: true, username: true } },
        },
    });
}
//# sourceMappingURL=order.service.js.map