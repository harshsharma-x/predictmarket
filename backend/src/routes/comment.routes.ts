import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { generalLimiter } from '../middleware/rateLimit.middleware';
import { createCommentSchema } from '../validators/comment.validator';

const router = Router();

router.get('/:marketId', generalLimiter, commentController.getComments);
router.post('/:marketId', authenticate as any, generalLimiter, validate(createCommentSchema), commentController.createComment as any);
router.delete('/:id', authenticate as any, generalLimiter, commentController.deleteComment as any);

export default router;
