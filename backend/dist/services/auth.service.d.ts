import { UpdateProfileInput } from '../validators/auth.validator';
export declare function getNonce(walletAddress: string): Promise<string>;
export declare function verifySignature(message: string, signature: string): Promise<string>;
export declare function getProfile(userId: string): Promise<{
    leaderboard: {
        totalPnl: number;
        totalTrades: number;
        winRate: number;
        rank: number;
    } | null;
    username: string | null;
    avatar: string | null;
    id: string;
    walletAddress: string;
    createdAt: Date;
    _count: {
        buyTrades: number;
        orders: number;
    };
}>;
export declare function updateProfile(userId: string, data: UpdateProfileInput): Promise<{
    username: string | null;
    avatar: string | null;
    id: string;
    walletAddress: string;
    updatedAt: Date;
}>;
//# sourceMappingURL=auth.service.d.ts.map