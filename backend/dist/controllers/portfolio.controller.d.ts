import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getPositions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getTradeHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function getPnL(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function claimWinnings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=portfolio.controller.d.ts.map