"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.verifySchema = void 0;
const zod_1 = require("zod");
exports.verifySchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'Message is required'),
    signature: zod_1.z.string().min(1, 'Signature is required'),
});
exports.updateProfileSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
        .optional(),
    avatar: zod_1.z.string().url('Avatar must be a valid URL').optional(),
});
//# sourceMappingURL=auth.validator.js.map