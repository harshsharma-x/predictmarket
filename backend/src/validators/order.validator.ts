import { z } from 'zod';

export const createOrderSchema = z.object({
  marketId: z.string().cuid('Invalid market ID'),
  outcomeId: z.string().cuid('Invalid outcome ID'),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['MARKET', 'LIMIT']),
  price: z.number().min(0.01).max(0.99).optional(),
  amount: z.number().positive('Amount must be positive'),
}).refine(
  (data) => data.type === 'MARKET' || (data.type === 'LIMIT' && data.price !== undefined),
  { message: 'Price is required for limit orders', path: ['price'] }
);

export const cancelOrderSchema = z.object({
  orderId: z.string().cuid('Invalid order ID'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
