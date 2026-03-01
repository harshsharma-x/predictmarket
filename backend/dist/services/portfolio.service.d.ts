export declare function getPortfolioSummary(userId: string): Promise<{
    totalValue: number;
    totalInvested: number;
    totalPnl: number;
    pnlPercentage: number;
    activePositions: number;
    totalPositions: number;
}>;
export declare function getPositions(userId: string): Promise<({
    market: {
        status: import(".prisma/client").$Enums.MarketStatus;
        id: string;
        question: string;
        resolutionDate: Date;
    };
    outcome: {
        label: string;
        price: number;
    };
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    marketId: string;
    outcomeId: string;
    shares: number;
    avgPrice: number;
    currentValue: number;
    pnl: number;
})[]>;
export declare function getTradeHistory(userId: string, params: {
    page: number;
    limit: number;
}): Promise<{
    data: {
        role: string;
        market: {
            question: string;
        };
        outcome: {
            label: string;
        };
        id: string;
        createdAt: Date;
        marketId: string;
        price: number;
        outcomeId: string;
        amount: number;
        txHash: string | null;
        buyerId: string;
        sellerId: string;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare function getPnL(userId: string): Promise<{
    marketId: string;
    marketQuestion: string;
    marketStatus: import(".prisma/client").$Enums.MarketStatus;
    outcomeLabel: string;
    shares: number;
    avgPrice: number;
    currentPrice: number;
    currentValue: number;
    invested: number;
    pnl: number;
    pnlPercentage: number;
}[]>;
export declare function claimWinnings(userId: string, marketId: string): Promise<{
    winnings: number;
    pnl: number;
    shares: number;
}>;
//# sourceMappingURL=portfolio.service.d.ts.map