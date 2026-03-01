import { Queue, Worker } from 'bullmq';
export declare const priceSimulationQueue: Queue<any, any, string, any, any, string>;
export declare function createPriceSimulationWorker(): Worker;
export declare function schedulePriceSimulation(): Promise<void>;
//# sourceMappingURL=priceSimulation.job.d.ts.map