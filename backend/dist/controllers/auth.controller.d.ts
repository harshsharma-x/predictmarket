import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function getNonce(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function verify(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map