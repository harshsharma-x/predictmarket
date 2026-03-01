import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map