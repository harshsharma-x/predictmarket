import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=comment.controller.d.ts.map