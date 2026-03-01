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
exports.getNonce = getNonce;
exports.verify = verify;
exports.getMe = getMe;
exports.updateProfile = updateProfile;
const authService = __importStar(require("../services/auth.service"));
async function getNonce(req, res, next) {
    try {
        const { walletAddress } = req.query;
        if (!walletAddress) {
            res.status(400).json({ success: false, error: 'walletAddress is required' });
            return;
        }
        const nonce = await authService.getNonce(walletAddress);
        res.json({ success: true, data: { nonce } });
    }
    catch (error) {
        next(error);
    }
}
async function verify(req, res, next) {
    try {
        const { message, signature } = req.body;
        const token = await authService.verifySignature(message, signature);
        res.json({ success: true, data: { token } });
    }
    catch (error) {
        next(error);
    }
}
async function getMe(req, res, next) {
    try {
        const profile = await authService.getProfile(req.user.id);
        res.json({ success: true, data: profile });
    }
    catch (error) {
        next(error);
    }
}
async function updateProfile(req, res, next) {
    try {
        const updated = await authService.updateProfile(req.user.id, req.body);
        res.json({ success: true, data: updated });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map