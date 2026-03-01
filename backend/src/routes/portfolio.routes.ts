import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(authenticate as any);

router.get('/summary', generalLimiter, portfolioController.getSummary as any);
router.get('/positions', generalLimiter, portfolioController.getPositions as any);
router.get('/trades', generalLimiter, portfolioController.getTradeHistory as any);
router.get('/pnl', generalLimiter, portfolioController.getPnL as any);
router.post('/claim/:marketId', generalLimiter, portfolioController.claimWinnings as any);

export default router;
