import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function listMarkets(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getFeaturedMarkets(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getMarketById(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function resolveMarket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=market.controller.d.ts.map