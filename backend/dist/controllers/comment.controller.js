"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = getComments;
exports.createComment = createComment;
exports.deleteComment = deleteComment;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
async function getComments(req, res, next) {
    try {
        const marketId = req.params.marketId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const { skip, take } = (0, helpers_1.paginate)(page, limit);
        const [comments, total] = await Promise.all([
            database_1.default.comment.findMany({
                where: { marketId },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
            }),
            database_1.default.comment.count({ where: { marketId } }),
        ]);
        const result = (0, helpers_1.formatPaginatedResponse)(comments, total, page, limit);
        res.json({ success: true, ...result });
    }
    catch (error) {
        next(error);
    }
}
async function createComment(req, res, next) {
    try {
        const marketId = req.params.marketId;
        const market = await database_1.default.market.findUnique({ where: { id: marketId } });
        if (!market)
            throw new errors_1.NotFoundError('Market not found');
        const comment = await database_1.default.comment.create({
            data: { userId: req.user.id, marketId, content: req.body.content },
            include: { user: { select: { walletAddress: true, username: true, avatar: true } } },
        });
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        next(error);
    }
}
async function deleteComment(req, res, next) {
    try {
        const comment = await database_1.default.comment.findUnique({ where: { id: req.params.id } });
        if (!comment)
            throw new errors_1.NotFoundError('Comment not found');
        if (comment.userId !== req.user.id)
            throw new errors_1.ForbiddenError('Not your comment');
        await database_1.default.comment.delete({ where: { id: req.params.id } });
        res.json({ success: true, data: { deleted: true } });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=comment.controller.js.map