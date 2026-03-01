import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getUserRank(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=leaderboard.controller.d.ts.map