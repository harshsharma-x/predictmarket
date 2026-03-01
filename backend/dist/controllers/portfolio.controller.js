"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
exports.getPositions = getPositions;
exports.getTradeHistory = getTradeHistory;
exports.getPnL = getPnL;
exports.claimWinnings = claimWinnings;
const portfolioService = __importStar(require("../services/portfolio.service"));
async function getSummary(req, res, next) {
    try {
        const summary = await portfolioService.getPortfolioSummary(req.user.id);
        res.json({ success: true, data: summary });
    }
    catch (error) {
        next(error);
    }
}
async function getPositions(req, res, next) {
    try {
        const positions = await portfolioService.getPositions(req.user.id);
        res.json({ success: true, data: positions });
    }
    catch (error) {
        next(error);
    }
}
async function getTradeHistory(req, res, next) {
    try {
        const result = await portfolioService.getTradeHistory(req.user.id, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
        });
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getPnL(req, res, next) {
    try {
        const pnl = await portfolioService.getPnL(req.user.id);
        res.json({ success: true, data: pnl });
    }
    catch (error) {
        next(error);
    }
}
async function claimWinnings(req, res, next) {
    try {
        const result = await portfolioService.claimWinnings(req.user.id, req.params.marketId);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=portfolio.controller.js.map