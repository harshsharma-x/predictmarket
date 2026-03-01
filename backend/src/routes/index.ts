import { Router } from 'express';
import authRoutes from './auth.routes';
import marketRoutes from './market.routes';
import orderRoutes from './order.routes';
import portfolioRoutes from './portfolio.routes';
import leaderboardRoutes from './leaderboard.routes';
import commentRoutes from './comment.routes';
import priceRoutes from './price.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/markets', marketRoutes);
router.use('/orders', orderRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/comments', commentRoutes);
router.use('/prices', priceRoutes);

export default router;
