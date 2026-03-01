import { Router } from 'express';
import * as priceController from '../controllers/price.controller';
import { generalLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/:marketId/stats', generalLimiter, priceController.getMarketStats);
router.get('/:marketId/:outcomeId', generalLimiter, priceController.getPriceHistory);

export default router;
