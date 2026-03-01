import { CreateOrderInput } from '../validators/order.validator';
export declare function createOrder(userId: string, data: CreateOrderInput): Promise<{
    market: {
        question: string;
    };
    outcome: {
        id: string;
        marketId: string;
        label: string;
        price: number;
        totalShares: number;
        totalVolume: number;
    };
} & {
    status: import(".prisma/client").$Enums.OrderStatus;
    type: import(".prisma/client").$Enums.OrderType;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    marketId: string;
    price: number;
    outcomeId: string;
    side: import(".prisma/client").$Enums.OrderSide;
    amount: number;
    filled: number;
    remaining: number;
    txHash: string | null;
}>;
export declare function getUserOrders(userId: string, filters: {
    status?: string;
    page: number;
    limit: number;
}): Promise<{
    data: ({
        market: {
            status: import(".prisma/client").$Enums.MarketStatus;
            question: string;
        };
        outcome: {
            label: string;
        };
    } & {
        status: import(".prisma/client").$Enums.OrderStatus;
        type: import(".prisma/client").$Enums.OrderType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        marketId: string;
        price: number;
        outcomeId: string;
        side: import(".prisma/client").$Enums.OrderSide;
        amount: number;
        filled: number;
        remaining: number;
        txHash: string | null;
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
export declare function getOrderById(id: string): Promise<{
    user: {
        username: string | null;
        walletAddress: string;
    };
    market: {
        question: string;
    };
    outcome: {
        label: string;
    };
} & {
    status: import(".prisma/client").$Enums.OrderStatus;
    type: import(".prisma/client").$Enums.OrderType;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    marketId: string;
    price: number;
    outcomeId: string;
    side: import(".prisma/client").$Enums.OrderSide;
    amount: number;
    filled: number;
    remaining: number;
    txHash: string | null;
}>;
export declare function cancelOrder(userId: string, orderId: string): Promise<{
    status: import(".prisma/client").$Enums.OrderStatus;
    type: import(".prisma/client").$Enums.OrderType;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    marketId: string;
    price: number;
    outcomeId: string;
    side: import(".prisma/client").$Enums.OrderSide;
    amount: number;
    filled: number;
    remaining: number;
    txHash: string | null;
}>;
export declare function getOrderBook(marketId: string): Promise<Record<string, {
    bids: Array<{
        price: number;
        amount: number;
    }>;
    asks: Array<{
        price: number;
        amount: number;
    }>;
}>>;
export declare function getMarketTrades(marketId: string, limit?: number): Promise<({
    outcome: {
        label: string;
    };
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
})[]>;
//# sourceMappingURL=order.service.d.ts.map