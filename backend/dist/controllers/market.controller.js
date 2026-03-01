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
exports.listMarkets = listMarkets;
exports.getFeaturedMarkets = getFeaturedMarkets;
exports.getCategories = getCategories;
exports.getMarketById = getMarketById;
exports.createMarket = createMarket;
exports.updateMarket = updateMarket;
exports.resolveMarket = resolveMarket;
const marketService = __importStar(require("../services/market.service"));
async function listMarkets(req, res, next) {
    try {
        const result = await marketService.listMarkets(req.query);
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getFeaturedMarkets(req, res, next) {
    try {
        const markets = await marketService.getFeaturedMarkets();
        res.json({ success: true, data: markets });
    }
    catch (error) {
        next(error);
    }
}
async function getCategories(req, res, next) {
    try {
        const categories = await marketService.getCategories();
        res.json({ success: true, data: categories });
    }
    catch (error) {
        next(error);
    }
}
async function getMarketById(req, res, next) {
    try {
        const market = await marketService.getMarketById(req.params.id);
        res.json({ success: true, data: market });
    }
    catch (error) {
        next(error);
    }
}
async function createMarket(req, res, next) {
    try {
        const market = await marketService.createMarket(req.body);
        res.status(201).json({ success: true, data: market });
    }
    catch (error) {
        next(error);
    }
}
async function updateMarket(req, res, next) {
    try {
        const market = await marketService.updateMarket(req.params.id, req.body);
        res.json({ success: true, data: market });
    }
    catch (error) {
        next(error);
    }
}
async function resolveMarket(req, res, next) {
    try {
        const market = await marketService.resolveMarket(req.params.id, req.body.outcome);
        res.json({ success: true, data: market });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=market.controller.js.map