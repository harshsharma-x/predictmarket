"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNonce = generateNonce;
exports.paginate = paginate;
exports.formatPaginatedResponse = formatPaginatedResponse;
exports.sleep = sleep;
exports.clamp = clamp;
const crypto_1 = __importDefault(require("crypto"));
function generateNonce() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
function paginate(page, limit) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    return {
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
    };
}
function formatPaginatedResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
//# sourceMappingURL=helpers.js.map