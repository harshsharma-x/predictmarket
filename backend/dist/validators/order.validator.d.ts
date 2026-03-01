import { z } from 'zod';
export declare const createOrderSchema: z.ZodEffects<z.ZodObject<{
    marketId: z.ZodString;
    outcomeId: z.ZodString;
    side: z.ZodEnum<["BUY", "SELL"]>;
    type: z.ZodEnum<["MARKET", "LIMIT"]>;
    price: z.ZodOptional<z.ZodNumber>;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "MARKET" | "LIMIT";
    marketId: string;
    outcomeId: string;
    side: "BUY" | "SELL";
    amount: number;
    price?: number | undefined;
}, {
    type: "MARKET" | "LIMIT";
    marketId: string;
    outcomeId: string;
    side: "BUY" | "SELL";
    amount: number;
    price?: number | undefined;
}>, {
    type: "MARKET" | "LIMIT";
    marketId: string;
    outcomeId: string;
    side: "BUY" | "SELL";
    amount: number;
    price?: number | undefined;
}, {
    type: "MARKET" | "LIMIT";
    marketId: string;
    outcomeId: string;
    side: "BUY" | "SELL";
    amount: number;
    price?: number | undefined;
}>;
export declare const cancelOrderSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
}, {
    orderId: string;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
//# sourceMappingURL=order.validator.d.ts.map