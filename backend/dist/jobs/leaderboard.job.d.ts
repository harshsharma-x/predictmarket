import { Queue, Worker } from 'bullmq';
export declare const leaderboardQueue: Queue<any, any, string, any, any, string>;
export declare function createLeaderboardWorker(): Worker;
export declare function scheduleLeaderboardUpdate(): Promise<void>;
//# sourceMappingURL=leaderboard.job.d.ts.map