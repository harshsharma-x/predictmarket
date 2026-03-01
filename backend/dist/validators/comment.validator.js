"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    content: zod_1.z
        .string()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment must be at most 1000 characters'),
});
//# sourceMappingURL=comment.validator.js.map