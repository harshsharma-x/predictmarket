import { Router } from 'express';
import * as marketController from '../controllers/market.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { createMarketSchema, updateMarketSchema, resolveMarketSchema, listMarketsSchema } from '../validators/market.validator';

const router = Router();

router.get('/', generalLimiter, validate(listMarketsSchema, 'query'), marketController.listMarkets);
router.get('/featured', generalLimiter, marketController.getFeaturedMarkets);
router.get('/categories', generalLimiter, marketController.getCategories);
router.get('/:id', generalLimiter, marketController.getMarketById);
router.post('/', authenticate as any, validate(createMarketSchema), marketController.createMarket as any);
router.put('/:id', authenticate as any, validate(updateMarketSchema), marketController.updateMarket as any);
router.post('/:id/resolve', authenticate as any, validate(resolveMarketSchema), marketController.resolveMarket as any);

export default router;
