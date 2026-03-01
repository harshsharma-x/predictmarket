import { CreateMarketInput, UpdateMarketInput, ListMarketsInput } from '../validators/market.validator';
export declare function listMarkets(params: ListMarketsInput): Promise<{
    data: {
        totalVolume: number;
        totalTrades: number;
        _count: {
            trades: number;
        };
        outcomes: {
            id: string;
            marketId: string;
            label: string;
            price: number;
            totalShares: number;
            totalVolume: number;
        }[];
        status: import(".prisma/client").$Enums.MarketStatus;
        outcome: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        question: string;
        description: string;
        category: string;
        imageUrl: string | null;
        resolutionSource: string | null;
        resolutionDate: Date;
        featured: boolean;
        contractAddress: string | null;
        resolvedAt: Date | null;
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
export declare function getFeaturedMarkets(): Promise<({
    outcomes: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    }[];
} & {
    status: import(".prisma/client").$Enums.MarketStatus;
    outcome: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    featured: boolean;
    contractAddress: string | null;
    resolvedAt: Date | null;
})[]>;
export declare function getCategories(): Promise<{
    category: string;
    count: number;
}[]>;
export declare function getMarketById(id: string): Promise<{
    totalVolume: number;
    totalTrades: number;
    totalComments: number;
    orderBook: {
        bids: {
            price: number;
            amount: number;
        }[];
        asks: {
            price: number;
            amount: number;
        }[];
    };
    _count: {
        comments: number;
        trades: number;
    };
    outcomes: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    }[];
    trades: ({
        buyer: {
            username: string | null;
            walletAddress: string;
        };
    } & {
        id: string;
        createdAt: Date;
        marketId: string;
        price: number;
        outcomeId: string;
        amount: number;
        txHash: string | null;
        buyerId: string;
        sellerId: string;
    })[];
    status: import(".prisma/client").$Enums.MarketStatus;
    outcome: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    featured: boolean;
    contractAddress: string | null;
    resolvedAt: Date | null;
}>;
export declare function createMarket(data: CreateMarketInput): Promise<{
    outcomes: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    }[];
} & {
    status: import(".prisma/client").$Enums.MarketStatus;
    outcome: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    featured: boolean;
    contractAddress: string | null;
    resolvedAt: Date | null;
}>;
export declare function updateMarket(id: string, data: UpdateMarketInput): Promise<{
    outcomes: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    }[];
} & {
    status: import(".prisma/client").$Enums.MarketStatus;
    outcome: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    featured: boolean;
    contractAddress: string | null;
    resolvedAt: Date | null;
}>;
export declare function resolveMarket(id: string, outcome: 'YES' | 'NO'): Promise<{
    outcomes: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    }[];
} & {
    status: import(".prisma/client").$Enums.MarketStatus;
    outcome: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    featured: boolean;
    contractAddress: string | null;
    resolvedAt: Date | null;
}>;
//# sourceMappingURL=market.service.d.ts.map