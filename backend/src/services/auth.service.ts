import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import prisma from '../config/database';
import redis from '../config/redis';
import { generateNonce } from '../utils/helpers';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import { UpdateProfileInput } from '../validators/auth.validator';

const NONCE_TTL = 600; // 10 minutes

export async function getNonce(walletAddress: string): Promise<string> {
  const address = walletAddress.toLowerCase();
  
  let user = await prisma.user.findUnique({ where: { walletAddress: address } });
  
  const nonce = generateNonce();
  
  if (!user) {
    user = await prisma.user.create({
      data: { walletAddress: address, nonce },
    });
  } else {
    await prisma.user.update({ where: { id: user.id }, data: { nonce } });
  }
  
  // Cache nonce in Redis for verification
  await redis.setex(`nonce:${address}`, NONCE_TTL, nonce);
  
  return nonce;
}

export async function verifySignature(message: string, signature: string): Promise<string> {
  try {
    const siweMessage = new SiweMessage(message);
    const result = await siweMessage.verify({ signature });
    
    if (!result.success) {
      throw new UnauthorizedError('Invalid signature');
    }
    
    const address = result.data.address.toLowerCase();
    const cachedNonce = await redis.get(`nonce:${address}`);
    
    if (!cachedNonce || cachedNonce !== result.data.nonce) {
      throw new UnauthorizedError('Invalid or expired nonce');
    }
    
    // Invalidate nonce
    await redis.del(`nonce:${address}`);
    
    // Get or create user
    let user = await prisma.user.findUnique({ where: { walletAddress: address } });
    if (!user) {
      user = await prisma.user.create({ data: { walletAddress: address } });
    }
    
    // Rotate nonce
    const newNonce = generateNonce();
    await prisma.user.update({ where: { id: user.id }, data: { nonce: newNonce } });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (jwt.sign as any)(
      { id: user.id, walletAddress: user.walletAddress },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    ) as string;
    
    return token;
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error;
    throw new UnauthorizedError('Signature verification failed');
  }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      walletAddress: true,
      username: true,
      avatar: true,
      createdAt: true,
      leaderboard: { select: { rank: true, totalPnl: true, totalTrades: true, winRate: true } },
      _count: { select: { orders: true, buyTrades: true } },
    },
  });
  
  if (!user) throw new NotFoundError('User not found');
  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  if (data.username) {
    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing && existing.id !== userId) {
      throw new ConflictError('Username already taken');
    }
  }
  
  return prisma.user.update({
    where: { id: userId },
    data: { ...(data.username && { username: data.username }), ...(data.avatar && { avatar: data.avatar }) },
    select: { id: true, walletAddress: true, username: true, avatar: true, updatedAt: true },
  });
}
