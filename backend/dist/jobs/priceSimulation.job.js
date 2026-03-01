"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSimulationQueue = void 0;
exports.createPriceSimulationWorker = createPriceSimulationWorker;
exports.schedulePriceSimulation = schedulePriceSimulation;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const database_1 = __importDefault(require("../config/database"));
const websocket_service_1 = require("../services/websocket.service");
const logger_1 = require("../utils/logger");
const helpers_1 = require("../utils/helpers");
const QUEUE_NAME = 'price-simulation';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis_1.redis;
exports.priceSimulationQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 50,
    },
});
function randomWalk(currentPrice, volatility = 0.02) {
    const meanReversionStrength = 0.1;
    const meanReversionForce = (0.5 - currentPrice) * meanReversionStrength;
    const randomShock = (Math.random() - 0.5) * volatility;
    const newPrice = currentPrice + meanReversionForce + randomShock;
    return (0, helpers_1.clamp)(newPrice, 0.01, 0.99);
}
async function simulatePrices() {
    const markets = await database_1.default.market.findMany({
        where: { status: 'ACTIVE' },
        include: { outcomes: true },
    });
    for (const market of markets) {
        const yesOutcome = market.outcomes.find((o) => o.label === 'YES');
        const noOutcome = market.outcomes.find((o) => o.label === 'NO');
        if (!yesOutcome || !noOutcome)
            continue;
        const newYesPrice = randomWalk(yesOutcome.price);
        const newNoPrice = (0, helpers_1.clamp)(1 - newYesPrice, 0.01, 0.99);
        await database_1.default.$transaction([
            database_1.default.outcome.update({
                where: { id: yesOutcome.id },
                data: { price: newYesPrice },
            }),
            database_1.default.outcome.update({
                where: { id: noOutcome.id },
                data: { price: newNoPrice },
            }),
        ]);
        // Emit price update via WebSocket
        (0, websocket_service_1.emitPriceUpdate)(market.id, [
            { id: yesOutcome.id, label: 'YES', price: newYesPrice },
            { id: noOutcome.id, label: 'NO', price: newNoPrice },
        ]);
    }
}
function createPriceSimulationWorker() {
    const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
        await simulatePrices();
        logger_1.logger.debug({ jobId: job.id }, 'Price simulation completed');
    }, { connection, concurrency: 1 });
    worker.on('failed', (job, err) => {
        logger_1.logger.error({ jobId: job?.id, err }, 'Price simulation job failed');
    });
    return worker;
}
async function schedulePriceSimulation() {
    await exports.priceSimulationQueue.add('simulate', {}, {
        repeat: { every: 10000 }, // Every 10 seconds
    });
    logger_1.logger.info('Price simulation scheduled');
}
//# sourceMappingURL=priceSimulation.job.js.map