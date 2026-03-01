import { Queue, Worker, Job, ConnectionOptions } from 'bullmq';
import { redis } from '../config/redis';
import { recalculateLeaderboard } from '../services/leaderboard.service';
import { logger } from '../utils/logger';

const QUEUE_NAME = 'leaderboard-update';
// Cast required because the project ioredis version may differ from BullMQ's bundled version
const connection = redis as unknown as ConnectionOptions;

export const leaderboardQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    removeOnComplete: 5,
    removeOnFail: 20,
  },
});

export function createLeaderboardWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await recalculateLeaderboard();
      logger.debug({ jobId: job.id }, 'Leaderboard recalculated');
    },
    { connection, concurrency: 1 }
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Leaderboard job failed');
  });

  return worker;
}

export async function scheduleLeaderboardUpdate(): Promise<void> {
  await leaderboardQueue.add(
    'recalculate',
    {},
    {
      repeat: { every: 5 * 60 * 1000 }, // Every 5 minutes
    }
  );
  logger.info('Leaderboard update scheduled');
}
