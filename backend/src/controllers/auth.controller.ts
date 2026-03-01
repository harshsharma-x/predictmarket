import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

export async function getNonce(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { walletAddress } = req.query as { walletAddress: string };
    if (!walletAddress) {
      res.status(400).json({ success: false, error: 'walletAddress is required' });
      return;
    }
    const nonce = await authService.getNonce(walletAddress);
    res.json({ success: true, data: { nonce } });
  } catch (error) {
    next(error);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { message, signature } = req.body;
    const token = await authService.verifySignature(message, signature);
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await authService.getProfile(req.user!.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const updated = await authService.updateProfile(req.user!.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}
