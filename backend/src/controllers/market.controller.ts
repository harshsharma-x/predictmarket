import { Request, Response, NextFunction } from 'express';
import * as marketService from '../services/market.service';
import { AuthenticatedRequest } from '../types';

export async function listMarkets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await marketService.listMarkets(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedMarkets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const markets = await marketService.getFeaturedMarkets();
    res.json({ success: true, data: markets });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await marketService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

export async function getMarketById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const market = await marketService.getMarketById(req.params.id);
    res.json({ success: true, data: market });
  } catch (error) {
    next(error);
  }
}

export async function createMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const market = await marketService.createMarket(req.body);
    res.status(201).json({ success: true, data: market });
  } catch (error) {
    next(error);
  }
}

export async function updateMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const market = await marketService.updateMarket(req.params.id, req.body);
    res.json({ success: true, data: market });
  } catch (error) {
    next(error);
  }
}

export async function resolveMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const market = await marketService.resolveMarket(req.params.id, req.body.outcome);
    res.json({ success: true, data: market });
  } catch (error) {
    next(error);
  }
}
