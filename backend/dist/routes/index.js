"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const market_routes_1 = __importDefault(require("./market.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const portfolio_routes_1 = __importDefault(require("./portfolio.routes"));
const leaderboard_routes_1 = __importDefault(require("./leaderboard.routes"));
const comment_routes_1 = __importDefault(require("./comment.routes"));
const price_routes_1 = __importDefault(require("./price.routes"));
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        uptime: process.uptime(),
    });
});
router.use('/auth', auth_routes_1.default);
router.use('/markets', market_routes_1.default);
router.use('/orders', order_routes_1.default);
router.use('/portfolio', portfolio_routes_1.default);
router.use('/leaderboard', leaderboard_routes_1.default);
router.use('/comments', comment_routes_1.default);
router.use('/prices', price_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map