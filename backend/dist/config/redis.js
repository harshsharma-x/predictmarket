"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.getRedisClient = getRedisClient;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
let redisClient;
function getRedisClient() {
    if (!redisClient) {
        redisClient = new ioredis_1.default(env_1.config.REDIS_URL, {
            maxRetriesPerRequest: null,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis connected');
        });
        redisClient.on('error', (err) => {
            logger_1.logger.error({ err }, 'Redis error');
        });
        redisClient.on('reconnecting', () => {
            logger_1.logger.warn('Redis reconnecting');
        });
    }
    return redisClient;
}
exports.redis = getRedisClient();
exports.default = exports.redis;
//# sourceMappingURL=redis.js.map