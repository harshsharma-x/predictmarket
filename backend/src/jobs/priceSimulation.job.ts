import { Queue, Worker, Job, ConnectionOptions } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/database';
import { emitPriceUpdate } from '../services/websocket.service';
import { logger } from '../utils/logger';
import { clamp } from '../utils/helpers';

const QUEUE_NAME = 'price-simulation';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis as unknown as ConnectionOptions;

export const priceSimulationQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
  },
});

function randomWalk(currentPrice: number, volatility = 0.02): number {
  const meanReversionStrength = 0.1;
  const meanReversionForce = (0.5 - currentPrice) * meanReversionStrength;
  const randomShock = (Math.random() - 0.5) * volatility;
  const newPrice = currentPrice + meanReversionForce + randomShock;
  return clamp(newPrice, 0.01, 0.99);
}

async function simulatePrices(): Promise<void> {
  const markets = await prisma.market.findMany({
    where: { status: 'ACTIVE' },
    include: { outcomes: true },
  });

  for (const market of markets) {
    const yesOutcome = market.outcomes.find((o: { label: string }) => o.label === 'YES');
    const noOutcome = market.outcomes.find((o: { label: string }) => o.label === 'NO');

    if (!yesOutcome || !noOutcome) continue;

    const newYesPrice = randomWalk(yesOutcome.price);
    const newNoPrice = clamp(1 - newYesPrice, 0.01, 0.99);

    await prisma.$transaction([
      prisma.outcome.update({
        where: { id: yesOutcome.id },
        data: { price: newYesPrice },
      }),
      prisma.outcome.update({
        where: { id: noOutcome.id },
        data: { price: newNoPrice },
      }),
    ]);

    // Emit price update via WebSocket
    emitPriceUpdate(market.id, [
      { id: yesOutcome.id, label: 'YES', price: newYesPrice },
      { id: noOutcome.id, label: 'NO', price: newNoPrice },
    ]);
  }
}

export function createPriceSimulationWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await simulatePrices();
      logger.debug({ jobId: job.id }, 'Price simulation completed');
    },
    { connection, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Price simulation job failed');
  });

  return worker;
}

export async function schedulePriceSimulation(): Promise<void> {
  await priceSimulationQueue.add(
    'simulate',
    {},
    {
      repeat: { every: 10000 }, // Every 10 seconds
    }
  );
  logger.info('Price simulation scheduled');
}
