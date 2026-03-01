import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { tradingLimiter, generalLimiter } from '../middleware/rateLimit.middleware';
import { createOrderSchema } from '../validators/order.validator';

const router = Router();

router.post('/', authenticate as any, tradingLimiter, validate(createOrderSchema), orderController.createOrder as any);
router.get('/my', authenticate as any, generalLimiter, orderController.getUserOrders as any);
router.get('/orderbook/:marketId', generalLimiter, orderController.getOrderBook as any);
router.get('/trades/:marketId', generalLimiter, orderController.getMarketTrades as any);
router.get('/:id', authenticate as any, generalLimiter, orderController.getOrderById as any);
router.delete('/:id', authenticate as any, tradingLimiter, orderController.cancelOrder as any);

export default router;
