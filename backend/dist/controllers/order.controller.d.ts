import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getOrderBook(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getMarketTrades(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map