"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardQueue = void 0;
exports.createLeaderboardWorker = createLeaderboardWorker;
exports.scheduleLeaderboardUpdate = scheduleLeaderboardUpdate;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const leaderboard_service_1 = require("../services/leaderboard.service");
const logger_1 = require("../utils/logger");
const QUEUE_NAME = 'leaderboard-update';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis_1.redis;
exports.leaderboardQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        removeOnComplete: 5,
        removeOnFail: 20,
    },
});
function createLeaderboardWorker() {
    const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
        await (0, leaderboard_service_1.recalculateLeaderboard)();
        logger_1.logger.debug({ jobId: job.id }, 'Leaderboard recalculated');
    }, { connection, concurrency: 1 });
    worker.on('failed', (job, err) => {
        logger_1.logger.error({ jobId: job?.id, err }, 'Leaderboard job failed');
    });
    return worker;
}
async function scheduleLeaderboardUpdate() {
    await exports.leaderboardQueue.add('recalculate', {}, {
        repeat: { every: 5 * 60 * 1000 }, // Every 5 minutes
    });
    logger_1.logger.info('Leaderboard update scheduled');
}
//# sourceMappingURL=leaderboard.job.js.map