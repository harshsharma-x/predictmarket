type Timeframe = '1h' | '24h' | '7d' | '30d' | 'all';
export declare function getPriceHistory(marketId: string, outcomeId: string, timeframe?: Timeframe): Promise<{
    price: number;
    timestamp: Date;
}[]>;
export declare function getMarketStats(marketId: string): Promise<{
    totalVolume: number;
    volume24h: number;
    totalTrades: number;
    priceChanges: Record<string, {
        open: number;
        current: number;
    }>;
}>;
export declare function recordPriceSnapshot(marketId: string, outcomeId: string, price: number): Promise<void>;
export {};
//# sourceMappingURL=price.service.d.ts.map