import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';
import { authenticate } from '../middleware/auth.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.get('/', generalLimiter, leaderboardController.getLeaderboard);
router.get('/me', authenticate as any, generalLimiter, leaderboardController.getUserRank as any);
router.get('/:userId', generalLimiter, leaderboardController.getUserRank as any);

export default router;
