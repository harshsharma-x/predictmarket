"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    marketId: zod_1.z.string().cuid('Invalid market ID'),
    outcomeId: zod_1.z.string().cuid('Invalid outcome ID'),
    side: zod_1.z.enum(['BUY', 'SELL']),
    type: zod_1.z.enum(['MARKET', 'LIMIT']),
    price: zod_1.z.number().min(0.01).max(0.99).optional(),
    amount: zod_1.z.number().positive('Amount must be positive'),
}).refine((data) => data.type === 'MARKET' || (data.type === 'LIMIT' && data.price !== undefined), { message: 'Price is required for limit orders', path: ['price'] });
exports.cancelOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().cuid('Invalid order ID'),
});
//# sourceMappingURL=order.validator.js.map