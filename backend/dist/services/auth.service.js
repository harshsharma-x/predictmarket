"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonce = getNonce;
exports.verifySignature = verifySignature;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const siwe_1 = require("siwe");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const database_1 = __importDefault(require("../config/database"));
const redis_1 = __importDefault(require("../config/redis"));
const helpers_1 = require("../utils/helpers");
const errors_1 = require("../utils/errors");
const NONCE_TTL = 600; // 10 minutes
async function getNonce(walletAddress) {
    const address = walletAddress.toLowerCase();
    let user = await database_1.default.user.findUnique({ where: { walletAddress: address } });
    const nonce = (0, helpers_1.generateNonce)();
    if (!user) {
        user = await database_1.default.user.create({
            data: { walletAddress: address, nonce },
        });
    }
    else {
        await database_1.default.user.update({ where: { id: user.id }, data: { nonce } });
    }
    // Cache nonce in Redis for verification
    await redis_1.default.setex(`nonce:${address}`, NONCE_TTL, nonce);
    return nonce;
}
async function verifySignature(message, signature) {
    try {
        const siweMessage = new siwe_1.SiweMessage(message);
        const result = await siweMessage.verify({ signature });
        if (!result.success) {
            throw new errors_1.UnauthorizedError('Invalid signature');
        }
        const address = result.data.address.toLowerCase();
        const cachedNonce = await redis_1.default.get(`nonce:${address}`);
        if (!cachedNonce || cachedNonce !== result.data.nonce) {
            throw new errors_1.UnauthorizedError('Invalid or expired nonce');
        }
        // Invalidate nonce
        await redis_1.default.del(`nonce:${address}`);
        // Get or create user
        let user = await database_1.default.user.findUnique({ where: { walletAddress: address } });
        if (!user) {
            user = await database_1.default.user.create({ data: { walletAddress: address } });
        }
        // Rotate nonce
        const newNonce = (0, helpers_1.generateNonce)();
        await database_1.default.user.update({ where: { id: user.id }, data: { nonce: newNonce } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = jsonwebtoken_1.default.sign({ id: user.id, walletAddress: user.walletAddress }, env_1.config.JWT_SECRET, { expiresIn: env_1.config.JWT_EXPIRES_IN });
        return token;
    }
    catch (error) {
        if (error instanceof errors_1.UnauthorizedError)
            throw error;
        throw new errors_1.UnauthorizedError('Signature verification failed');
    }
}
async function getProfile(userId) {
    const user = await database_1.default.user.findUnique({
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
    if (!user)
        throw new errors_1.NotFoundError('User not found');
    return user;
}
async function updateProfile(userId, data) {
    if (data.username) {
        const existing = await database_1.default.user.findUnique({ where: { username: data.username } });
        if (existing && existing.id !== userId) {
            throw new errors_1.ConflictError('Username already taken');
        }
    }
    return database_1.default.user.update({
        where: { id: userId },
        data: { ...(data.username && { username: data.username }), ...(data.avatar && { avatar: data.avatar }) },
        select: { id: true, walletAddress: true, username: true, avatar: true, updatedAt: true },
    });
}
//# sourceMappingURL=auth.service.js.map