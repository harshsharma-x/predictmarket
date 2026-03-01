import { z } from 'zod';
export declare const createCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
//# sourceMappingURL=comment.validator.d.ts.map