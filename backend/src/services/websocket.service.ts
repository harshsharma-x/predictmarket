import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { AuthUser } from '../types';

let io: SocketIOServer;

interface MarketPriceUpdate {
  marketId: string;
  outcomes: Array<{ id: string; label: string; price: number }>;
  timestamp: Date;
}

interface TradeEvent {
  id: string;
  marketId: string;
  outcomeId: string;
  price: number;
  amount: number;
  createdAt: Date;
}

export function setupWebSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.CORS_ORIGIN.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Optional JWT authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as AuthUser;
        (socket as Socket & { user?: AuthUser }).user = decoded;
      } catch {
        // Token invalid, proceed as unauthenticated
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as Socket & { user?: AuthUser }).user;
    logger.debug({ socketId: socket.id, userId: user?.id }, 'WebSocket client connected');

    socket.on('subscribe:market', (marketId: string) => {
      socket.join(`market:${marketId}`);
      logger.debug({ socketId: socket.id, marketId }, 'Subscribed to market');
    });

    socket.on('unsubscribe:market', (marketId: string) => {
      socket.leave(`market:${marketId}`);
    });

    socket.on('subscribe:portfolio', () => {
      if (user) {
        socket.join(`portfolio:${user.id}`);
        logger.debug({ socketId: socket.id, userId: user.id }, 'Subscribed to portfolio');
      }
    });

    socket.on('disconnect', (reason) => {
      logger.debug({ socketId: socket.id, reason }, 'WebSocket client disconnected');
    });

    socket.on('error', (err) => {
      logger.error({ socketId: socket.id, err }, 'WebSocket error');
    });
  });

  logger.info('WebSocket server initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('WebSocket server not initialized');
  return io;
}

export function emitPriceUpdate(marketId: string, outcomes: Array<{ id: string; label: string; price: number }>): void {
  if (!io) return;
  const payload: MarketPriceUpdate = { marketId, outcomes, timestamp: new Date() };
  io.to(`market:${marketId}`).emit('price:update', payload);
}

export function emitOrderBookUpdate(marketId: string, orderbook: unknown): void {
  if (!io) return;
  io.to(`market:${marketId}`).emit('orderbook:update', { marketId, orderbook, timestamp: new Date() });
}

export function emitNewTrade(trade: TradeEvent): void {
  if (!io) return;
  io.to(`market:${trade.marketId}`).emit('trade:new', { ...trade, timestamp: new Date() });
}

export function emitMarketResolved(market: { id: string; question: string; outcome: string | null }): void {
  if (!io) return;
  io.to(`market:${market.id}`).emit('market:resolved', { ...market, timestamp: new Date() });
  io.emit('market:resolved:global', { marketId: market.id, outcome: market.outcome });
}

export function emitPositionUpdate(userId: string, position: unknown): void {
  if (!io) return;
  io.to(`portfolio:${userId}`).emit('position:update', { position, timestamp: new Date() });
}
