"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, _next) {
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: err.flatten().fieldErrors,
        });
        return;
    }
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({ success: false, error: 'Resource already exists' });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({ success: false, error: 'Resource not found' });
            return;
        }
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ success: false, error: 'Invalid token' });
        return;
    }
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({ success: false, error: 'Token expired' });
        return;
    }
    // Operational errors (AppError subclasses)
    if (err instanceof errors_1.AppError && err.isOperational) {
        res.status(err.statusCode).json({ success: false, error: err.message });
        return;
    }
    // Unknown errors
    logger_1.logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');
    res.status(500).json({ success: false, error: 'Internal server error' });
}
function notFoundHandler(req, res) {
    res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
}
//# sourceMappingURL=error.middleware.js.map