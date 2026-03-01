import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authLimiter, generalLimiter } from '../middleware/rateLimit.middleware';
import { verifySchema, updateProfileSchema } from '../validators/auth.validator';

const router = Router();

router.get('/nonce', authLimiter, authController.getNonce);
router.post('/verify', authLimiter, validate(verifySchema), authController.verify as any);
router.get('/me', authenticate as any, generalLimiter, authController.getMe as any);
router.put('/profile', authenticate as any, generalLimiter, validate(updateProfileSchema), authController.updateProfile as any);

export default router;
