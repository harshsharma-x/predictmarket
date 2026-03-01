import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { AuthenticatedRequest } from '../types';

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.createOrder(req.user!.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await orderService.getUserOrders(req.user!.id, {
      status: req.query.status as string | undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.cancelOrder(req.user!.id, req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function getOrderBook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orderBook = await orderService.getOrderBook(req.params.marketId);
    res.json({ success: true, data: orderBook });
  } catch (error) {
    next(error);
  }
}

export async function getMarketTrades(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const trades = await orderService.getMarketTrades(req.params.marketId, limit);
    res.json({ success: true, data: trades });
  } catch (error) {
    next(error);
  }
}
