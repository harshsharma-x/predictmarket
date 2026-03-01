import { Queue, Worker, Job, ConnectionOptions } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/database';
import { recordPriceSnapshot } from '../services/price.service';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'price-snapshot';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis as unknown as ConnectionOptions;

export const priceSnapshotQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
  },
});

async function takeSnapshots(): Promise<void> {
  const markets = await prisma.market.findMany({
    where: { status: 'ACTIVE' },
    include: { outcomes: true },
  });

  for (const market of markets) {
    for (const outcome of market.outcomes) {
      await recordPriceSnapshot(market.id, outcome.id, outcome.price);
    }
  }
}

export function createPriceSnapshotWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await takeSnapshots();
      logger.debug({ jobId: job.id }, 'Price snapshots taken');
    },
    { connection, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Price snapshot job failed');
  });

  return worker;
}

export async function schedulePriceSnapshots(): Promise<void> {
  await priceSnapshotQueue.add(
    'snapshot',
    {},
    {
      repeat: { every: 60 * 1000 }, // Every minute
    }
  );
  logger.info('Price snapshots scheduled');
}
