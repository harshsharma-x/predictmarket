import { Queue, Worker } from 'bullmq';
export declare const priceSnapshotQueue: Queue<any, any, string, any, any, string>;
export declare function createPriceSnapshotWorker(): Worker;
export declare function schedulePriceSnapshots(): Promise<void>;
//# sourceMappingURL=priceSnapshot.job.d.ts.map