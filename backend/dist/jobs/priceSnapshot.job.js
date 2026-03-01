"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSnapshotQueue = void 0;
exports.createPriceSnapshotWorker = createPriceSnapshotWorker;
exports.schedulePriceSnapshots = schedulePriceSnapshots;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const database_1 = __importDefault(require("../config/database"));
const price_service_1 = require("../services/price.service");
const logger_1 = require("../utils/logger");
const QUEUE_NAME = 'price-snapshot';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis_1.redis;
exports.priceSnapshotQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
    },
});
async function takeSnapshots() {
    const markets = await database_1.default.market.findMany({
        where: { status: 'ACTIVE' },
        include: { outcomes: true },
    });
    for (const market of markets) {
        for (const outcome of market.outcomes) {
            await (0, price_service_1.recordPriceSnapshot)(market.id, outcome.id, outcome.price);
        }
    }
}
function createPriceSnapshotWorker() {
    const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
        await takeSnapshots();
        logger_1.logger.debug({ jobId: job.id }, 'Price snapshots taken');
    }, { connection, concurrency: 1 });
    worker.on('failed', (job, err) => {
        logger_1.logger.error({ jobId: job?.id, err }, 'Price snapshot job failed');
    });
    return worker;
}
async function schedulePriceSnapshots() {
    await exports.priceSnapshotQueue.add('snapshot', {}, {
        repeat: { every: 60 * 1000 }, // Every minute
    });
    logger_1.logger.info('Price snapshots scheduled');
}
//# sourceMappingURL=priceSnapshot.job.js.map