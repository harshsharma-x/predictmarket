"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
exports.getIO = getIO;
exports.emitPriceUpdate = emitPriceUpdate;
exports.emitOrderBookUpdate = emitOrderBookUpdate;
exports.emitNewTrade = emitNewTrade;
exports.emitMarketResolved = emitMarketResolved;
exports.emitPositionUpdate = emitPositionUpdate;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
let io;
function setupWebSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.config.CORS_ORIGIN.split(',').map((o) => o.trim()),
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });
    // Optional JWT authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
                socket.user = decoded;
            }
            catch {
                // Token invalid, proceed as unauthenticated
            }
        }
        next();
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        logger_1.logger.debug({ socketId: socket.id, userId: user?.id }, 'WebSocket client connected');
        socket.on('subscribe:market', (marketId) => {
            socket.join(`market:${marketId}`);
            logger_1.logger.debug({ socketId: socket.id, marketId }, 'Subscribed to market');
        });
        socket.on('unsubscribe:market', (marketId) => {
            socket.leave(`market:${marketId}`);
        });
        socket.on('subscribe:portfolio', () => {
            if (user) {
                socket.join(`portfolio:${user.id}`);
                logger_1.logger.debug({ socketId: socket.id, userId: user.id }, 'Subscribed to portfolio');
            }
        });
        socket.on('disconnect', (reason) => {
            logger_1.logger.debug({ socketId: socket.id, reason }, 'WebSocket client disconnected');
        });
        socket.on('error', (err) => {
            logger_1.logger.error({ socketId: socket.id, err }, 'WebSocket error');
        });
    });
    logger_1.logger.info('WebSocket server initialized');
    return io;
}
function getIO() {
    if (!io)
        throw new Error('WebSocket server not initialized');
    return io;
}
function emitPriceUpdate(marketId, outcomes) {
    if (!io)
        return;
    const payload = { marketId, outcomes, timestamp: new Date() };
    io.to(`market:${marketId}`).emit('price:update', payload);
}
function emitOrderBookUpdate(marketId, orderbook) {
    if (!io)
        return;
    io.to(`market:${marketId}`).emit('orderbook:update', { marketId, orderbook, timestamp: new Date() });
}
function emitNewTrade(trade) {
    if (!io)
        return;
    io.to(`market:${trade.marketId}`).emit('trade:new', { ...trade, timestamp: new Date() });
}
function emitMarketResolved(market) {
    if (!io)
        return;
    io.to(`market:${market.id}`).emit('market:resolved', { ...market, timestamp: new Date() });
    io.emit('market:resolved:global', { marketId: market.id, outcome: market.outcome });
}
function emitPositionUpdate(userId, position) {
    if (!io)
        return;
    io.to(`portfolio:${userId}`).emit('position:update', { position, timestamp: new Date() });
}
//# sourceMappingURL=websocket.service.js.map