import { Queue, Worker } from 'bullmq';
export declare const marketResolutionQueue: Queue<any, any, string, any, any, string>;
export declare function createMarketResolutionWorker(): Worker;
export declare function scheduleMarketResolution(): Promise<void>;
//# sourceMappingURL=marketResolution.job.d.ts.map