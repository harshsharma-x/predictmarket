import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
interface TradeEvent {
    id: string;
    marketId: string;
    outcomeId: string;
    price: number;
    amount: number;
    createdAt: Date;
}
export declare function setupWebSocket(httpServer: HttpServer): SocketIOServer;
export declare function getIO(): SocketIOServer;
export declare function emitPriceUpdate(marketId: string, outcomes: Array<{
    id: string;
    label: string;
    price: number;
}>): void;
export declare function emitOrderBookUpdate(marketId: string, orderbook: unknown): void;
export declare function emitNewTrade(trade: TradeEvent): void;
export declare function emitMarketResolved(market: {
    id: string;
    question: string;
    outcome: string | null;
}): void;
export declare function emitPositionUpdate(userId: string, position: unknown): void;
export {};
//# sourceMappingURL=websocket.service.d.ts.map