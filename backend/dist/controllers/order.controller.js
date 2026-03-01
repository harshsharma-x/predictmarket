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
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getOrderById = getOrderById;
exports.cancelOrder = cancelOrder;
exports.getOrderBook = getOrderBook;
exports.getMarketTrades = getMarketTrades;
const orderService = __importStar(require("../services/order.service"));
async function createOrder(req, res, next) {
    try {
        const order = await orderService.createOrder(req.user.id, req.body);
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
}
async function getUserOrders(req, res, next) {
    try {
        const result = await orderService.getUserOrders(req.user.id, {
            status: req.query.status,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
        });
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function getOrderById(req, res, next) {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
}
async function cancelOrder(req, res, next) {
    try {
        const order = await orderService.cancelOrder(req.user.id, req.params.id);
        res.json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
}
async function getOrderBook(req, res, next) {
    try {
        const orderBook = await orderService.getOrderBook(req.params.marketId);
        res.json({ success: true, data: orderBook });
    }
    catch (error) {
        next(error);
    }
}
async function getMarketTrades(req, res, next) {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const trades = await orderService.getMarketTrades(req.params.marketId, limit);
        res.json({ success: true, data: trades });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.controller.js.map