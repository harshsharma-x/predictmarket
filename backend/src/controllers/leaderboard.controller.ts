import { Request, Response, NextFunction } from 'express';
import * as leaderboardService from '../services/leaderboard.service';
import { AuthenticatedRequest } from '../types';

export async function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await leaderboardService.getLeaderboard({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getUserRank(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.userId || req.user!.id;
    const rank = await leaderboardService.getUserRank(userId);
    res.json({ success: true, data: rank });
  } catch (error) {
    next(error);
  }
}
