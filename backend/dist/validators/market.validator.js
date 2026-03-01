"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMarketsSchema = exports.resolveMarketSchema = exports.updateMarketSchema = exports.createMarketSchema = void 0;
const zod_1 = require("zod");
exports.createMarketSchema = zod_1.z.object({
    question: zod_1.z.string().min(10, 'Question must be at least 10 characters').max(500),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').max(5000),
    category: zod_1.z.string().min(1, 'Category is required'),
    imageUrl: zod_1.z.string().url().optional(),
    resolutionSource: zod_1.z.string().optional(),
    resolutionDate: zod_1.z.string().datetime().or(zod_1.z.string().transform((s) => new Date(s).toISOString())),
    featured: zod_1.z.boolean().optional().default(false),
    contractAddress: zod_1.z.string().optional(),
});
exports.updateMarketSchema = exports.createMarketSchema.partial().omit({ resolutionDate: true }).extend({
    resolutionDate: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
});
exports.resolveMarketSchema = zod_1.z.object({
    outcome: zod_1.z.enum(['YES', 'NO']),
});
exports.listMarketsSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'PAUSED', 'RESOLVED', 'CANCELLED']).optional(),
    sort: zod_1.z.enum(['newest', 'oldest', 'volume', 'closing_soon', 'featured']).optional().default('newest'),
    page: zod_1.z.string().optional().default('1').transform(Number),
    limit: zod_1.z.string().optional().default('20').transform(Number),
    search: zod_1.z.string().optional(),
    featured: zod_1.z.string().optional().transform((v) => v === 'true'),
});
//# sourceMappingURL=market.validator.js.map