import { Order } from '@prisma/client';
export declare function matchOrder(order: Order): Promise<void>;
export declare function executeTrade(buyOrder: Order, sellOrder: Order, price: number, amount: number): Promise<void>;
//# sourceMappingURL=matching.service.d.ts.map