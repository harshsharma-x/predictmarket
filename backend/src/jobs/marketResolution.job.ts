import { Queue, Worker, Job, ConnectionOptions } from 'bullmq';
import { redis } from '../config/redis';
import prisma from '../config/database';
import { resolveMarket } from '../services/market.service';
import { emitMarketResolved } from '../services/websocket.service';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'market-resolution';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis as unknown as ConnectionOptions;

export const marketResolutionQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
  },
});

async function checkAndResolveMarkets(): Promise<void> {
  const now = new Date();

  const expiredMarkets = await prisma.market.findMany({
    where: {
      status: 'ACTIVE',
      resolutionDate: { lte: now },
    },
  });

  for (const market of expiredMarkets) {
    try {
      // Simple resolution: determine outcome based on current YES price.
      // In production this would use an oracle or admin decision.
      const outcomes = await prisma.outcome.findMany({
        where: { marketId: market.id },
      });
      const yesOutcome = outcomes.find((o: { label: string; price: number }) => o.label === 'YES');
      const determinedOutcome = yesOutcome && yesOutcome.price >= 0.5 ? 'YES' : 'NO';

      const resolved = await resolveMarket(market.id, determinedOutcome as 'YES' | 'NO');

      emitMarketResolved({
        id: market.id,
        question: market.question,
        outcome: determinedOutcome,
      });

      logger.info({ marketId: market.id, outcome: determinedOutcome }, 'Market auto-resolved');
    } catch (err) {
      logger.error({ err, marketId: market.id }, 'Failed to auto-resolve market');
    }
  }
}

export function createMarketResolutionWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await checkAndResolveMarkets();
      logger.debug({ jobId: job.id }, 'Market resolution check completed');
    },
    { connection, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Market resolution job failed');
  });

  return worker;
}

export async function scheduleMarketResolution(): Promise<void> {
  await marketResolutionQueue.add(
    'check-resolution',
    {},
    {
      repeat: { every: 60 * 1000 }, // Every minute
    }
  );
  logger.info('Market resolution check scheduled');
}
