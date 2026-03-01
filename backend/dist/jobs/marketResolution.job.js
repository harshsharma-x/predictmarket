"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketResolutionQueue = void 0;
exports.createMarketResolutionWorker = createMarketResolutionWorker;
exports.scheduleMarketResolution = scheduleMarketResolution;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const database_1 = __importDefault(require("../config/database"));
const market_service_1 = require("../services/market.service");
const websocket_service_1 = require("../services/websocket.service");
const logger_1 = require("../utils/logger");
const QUEUE_NAME = 'market-resolution';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis_1.redis;
exports.marketResolutionQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
    },
});
async function checkAndResolveMarkets() {
    const now = new Date();
    const expiredMarkets = await database_1.default.market.findMany({
        where: {
            status: 'ACTIVE',
            resolutionDate: { lte: now },
        },
    });
    for (const market of expiredMarkets) {
        try {
            // Simple resolution: determine outcome based on current YES price.
            // In production this would use an oracle or admin decision.
            const outcomes = await database_1.default.outcome.findMany({
                where: { marketId: market.id },
            });
            const yesOutcome = outcomes.find((o) => o.label === 'YES');
            const determinedOutcome = yesOutcome && yesOutcome.price >= 0.5 ? 'YES' : 'NO';
            const resolved = await (0, market_service_1.resolveMarket)(market.id, determinedOutcome);
            (0, websocket_service_1.emitMarketResolved)({
                id: market.id,
                question: market.question,
                outcome: determinedOutcome,
            });
            logger_1.logger.info({ marketId: market.id, outcome: determinedOutcome }, 'Market auto-resolved');
        }
        catch (err) {
            logger_1.logger.error({ err, marketId: market.id }, 'Failed to auto-resolve market');
        }
    }
}
function createMarketResolutionWorker() {
    const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
        await checkAndResolveMarkets();
        logger_1.logger.debug({ jobId: job.id }, 'Market resolution check completed');
    }, { connection, concurrency: 1 });
    worker.on('failed', (job, err) => {
        logger_1.logger.error({ jobId: job?.id, err }, 'Market resolution job failed');
    });
    return worker;
}
async function scheduleMarketResolution() {
    await exports.marketResolutionQueue.add('check-resolution', {}, {
        repeat: { every: 60 * 1000 }, // Every minute
    });
    logger_1.logger.info('Market resolution check scheduled');
}
//# sourceMappingURL=marketResolution.job.js.map