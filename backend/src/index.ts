import 'dotenv/config';
import http from 'http';
import { createApp } from './app';
import { config } from './config/env';
import prisma from './config/database';
import { redis } from './config/redis';
import { setupWebSocket } from './services/websocket.service';
import { getBlockchainService } from './services/blockchain.service';
import {
  createPriceSimulationWorker,
  schedulePriceSimulation,
} from './jobs/priceSimulation.job';
import {
  createMarketResolutionWorker,
  scheduleMarketResolution,
} from './jobs/marketResolution.job';
import { createLeaderboardWorker, scheduleLeaderboardUpdate } from './jobs/leaderboard.job';
import { createPriceSnapshotWorker, schedulePriceSnapshots } from './jobs/priceSnapshot.job';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  // Test database connection
  await prisma.$connect();
  logger.info('Database connected');

  // Test Redis connection
  await redis.ping();
  logger.info('Redis connected');

  // Create HTTP server
  const app = createApp();
  const server = http.createServer(app);

  // Setup WebSocket
  setupWebSocket(server);

  // Initialize blockchain service (non-blocking)
  try {
    getBlockchainService();
  } catch (err) {
    logger.warn({ err }, 'Blockchain service initialization failed');
  }

  // Start background jobs
  if (config.NODE_ENV !== 'test') {
    createPriceSimulationWorker();
    createMarketResolutionWorker();
    createLeaderboardWorker();
    createPriceSnapshotWorker();

    await schedulePriceSimulation();
    await scheduleMarketResolution();
    await scheduleLeaderboardUpdate();
    await schedulePriceSnapshots();

    logger.info('Background jobs started');
  }

  // Start server
  server.listen(config.PORT, () => {
    logger.info(`🚀 PredictMarket server running on port ${config.PORT} (${config.NODE_ENV})`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      await redis.quit();
      logger.info('Server shut down');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled rejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught exception');
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
