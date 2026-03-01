export declare enum MarketStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    RESOLVED = "RESOLVED",
    CANCELLED = "CANCELLED"
}
export type MarketCategory = 'Politics' | 'Crypto' | 'Sports' | 'Tech' | 'Entertainment' | 'Science' | 'World Events' | 'Finance' | 'Other';
export interface OutcomeDetails {
    id: string;
    label: string;
    price: number;
    totalShares: number;
    totalVolume: number;
}
export interface MarketWithDetails {
    id: string;
    question: string;
    description: string;
    category: string;
    imageUrl: string | null;
    resolutionSource: string | null;
    resolutionDate: Date;
    resolvedAt: Date | null;
    outcome: string | null;
    status: MarketStatus;
    contractAddress: string | null;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    outcomes: OutcomeDetails[];
    totalVolume: number;
    totalTrades: number;
}
//# sourceMappingURL=market.types.d.ts.map