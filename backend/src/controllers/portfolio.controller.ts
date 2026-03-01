import { Response, NextFunction } from 'express';
import * as portfolioService from '../services/portfolio.service';
import { AuthenticatedRequest } from '../types';

export async function getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await portfolioService.getPortfolioSummary(req.user!.id);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

export async function getPositions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const positions = await portfolioService.getPositions(req.user!.id);
    res.json({ success: true, data: positions });
  } catch (error) {
    next(error);
  }
}

export async function getTradeHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await portfolioService.getTradeHistory(req.user!.id, {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getPnL(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const pnl = await portfolioService.getPnL(req.user!.id);
    res.json({ success: true, data: pnl });
  } catch (error) {
    next(error);
  }
}

export async function claimWinnings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await portfolioService.claimWinnings(req.user!.id, req.params.marketId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
