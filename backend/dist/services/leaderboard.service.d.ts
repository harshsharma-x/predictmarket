export declare function getLeaderboard(params: {
    page: number;
    limit: number;
}): Promise<{
    data: ({
        user: {
            username: string | null;
            avatar: string | null;
            walletAddress: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        totalPnl: number;
        totalTrades: number;
        winRate: number;
        rank: number;
    })[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
export declare function getUserRank(userId: string): Promise<({
    user: {
        username: string | null;
        avatar: string | null;
        walletAddress: string;
    };
} & {
    id: string;
    updatedAt: Date;
    userId: string;
    totalPnl: number;
    totalTrades: number;
    winRate: number;
    rank: number;
}) | null>;
export declare function recalculateLeaderboard(): Promise<void>;
//# sourceMappingURL=leaderboard.service.d.ts.map