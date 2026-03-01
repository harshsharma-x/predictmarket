export declare class BlockchainService {
    private provider;
    private contract;
    private readonly contractABI;
    constructor();
    private setupEventListeners;
    getBlockNumber(): Promise<number>;
    getMarketFromChain(marketId: string): Promise<{
        question: string;
        resolutionDate: Date;
        resolved: boolean;
        outcome: boolean;
    } | null>;
    getPriceFromChain(marketId: string): Promise<{
        yesPrice: number;
        noPrice: number;
    } | null>;
    isConnected(): boolean;
}
export declare function getBlockchainService(): BlockchainService;
//# sourceMappingURL=blockchain.service.d.ts.map