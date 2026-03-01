import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { paginate, formatPaginatedResponse } from '../utils/helpers';

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const marketId = req.params.marketId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { skip, take } = paginate(page, limit);

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { marketId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
      }),
      prisma.comment.count({ where: { marketId } }),
    ]);

    const result = formatPaginatedResponse(comments, total, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const marketId = req.params.marketId;
    const market = await prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundError('Market not found');

    const comment = await prisma.comment.create({
      data: { userId: req.user!.id, marketId, content: req.body.content },
      include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) throw new NotFoundError('Comment not found');
    if (comment.userId !== req.user!.id) throw new ForbiddenError('Not your comment');

    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    next(error);
  }
}
