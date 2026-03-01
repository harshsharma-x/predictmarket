import { Request, Response, NextFunction } from 'express';
import * as priceService from '../services/price.service';

export async function getPriceHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { marketId, outcomeId } = req.params;
    const timeframe = (req.query.timeframe as string) || '24h';
    const history = await priceService.getPriceHistory(marketId, outcomeId, timeframe as any);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
}

export async function getMarketStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await priceService.getMarketStats(req.params.marketId);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}
