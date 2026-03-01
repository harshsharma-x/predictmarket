import { Request } from 'express';

export interface AuthUser {
  id: string;
  walletAddress: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
