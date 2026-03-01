"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
function createApp() {
    const app = (0, express_1.default)();
    // Security headers
    app.use((0, helmet_1.default)());
    // CORS
    app.use((0, cors_1.default)(cors_2.corsOptions));
    // HTTP logging
    app.use((0, morgan_1.default)('combined', {
        stream: { write: (message) => logger_1.logger.info(message.trim()) },
        skip: (req) => req.path === '/api/health',
    }));
    // Body parsing
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Trust proxy for rate limiting behind reverse proxy
    app.set('trust proxy', 1);
    // Global rate limiter
    app.use('/api', rateLimit_middleware_1.generalLimiter);
    // Routes
    app.use('/api', routes_1.default);
    // 404 handler
    app.use(error_middleware_1.notFoundHandler);
    // Error handler (must be last)
    app.use(error_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map