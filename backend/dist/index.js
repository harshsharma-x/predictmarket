"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = __importDefault(require("./config/database"));
const redis_1 = require("./config/redis");
const websocket_service_1 = require("./services/websocket.service");
const blockchain_service_1 = require("./services/blockchain.service");
const priceSimulation_job_1 = require("./jobs/priceSimulation.job");
const marketResolution_job_1 = require("./jobs/marketResolution.job");
const leaderboard_job_1 = require("./jobs/leaderboard.job");
const priceSnapshot_job_1 = require("./jobs/priceSnapshot.job");
const logger_1 = require("./utils/logger");
async function main() {
    // Test database connection
    await database_1.default.$connect();
    logger_1.logger.info('Database connected');
    // Test Redis connection
    await redis_1.redis.ping();
    logger_1.logger.info('Redis connected');
    // Create HTTP server
    const app = (0, app_1.createApp)();
    const server = http_1.default.createServer(app);
    // Setup WebSocket
    (0, websocket_service_1.setupWebSocket)(server);
    // Initialize blockchain service (non-blocking)
    try {
        (0, blockchain_service_1.getBlockchainService)();
    }
    catch (err) {
        logger_1.logger.warn({ err }, 'Blockchain service initialization failed');
    }
    // Start background jobs
    if (env_1.config.NODE_ENV !== 'test') {
        (0, priceSimulation_job_1.createPriceSimulationWorker)();
        (0, marketResolution_job_1.createMarketResolutionWorker)();
        (0, leaderboard_job_1.createLeaderboardWorker)();
        (0, priceSnapshot_job_1.createPriceSnapshotWorker)();
        await (0, priceSimulation_job_1.schedulePriceSimulation)();
        await (0, marketResolution_job_1.scheduleMarketResolution)();
        await (0, leaderboard_job_1.scheduleLeaderboardUpdate)();
        await (0, priceSnapshot_job_1.schedulePriceSnapshots)();
        logger_1.logger.info('Background jobs started');
    }
    // Start server
    server.listen(env_1.config.PORT, () => {
        logger_1.logger.info(`🚀 PredictMarket server running on port ${env_1.config.PORT} (${env_1.config.NODE_ENV})`);
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
        logger_1.logger.info(`${signal} received, shutting down gracefully`);
        server.close(async () => {
            await database_1.default.$disconnect();
            await redis_1.redis.quit();
            logger_1.logger.info('Server shut down');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error({ reason, promise }, 'Unhandled rejection');
    });
    process.on('uncaughtException', (err) => {
        logger_1.logger.error({ err }, 'Uncaught exception');
        process.exit(1);
    });
}
main().catch((err) => {
    logger_1.logger.error({ err }, 'Failed to start server');
    process.exit(1);
});
//# sourceMappingURL=index.js.map