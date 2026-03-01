import { z } from 'zod';
export declare const verifySchema: z.ZodObject<{
    message: z.ZodString;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    signature: string;
}, {
    message: string;
    signature: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username?: string | undefined;
    avatar?: string | undefined;
}, {
    username?: string | undefined;
    avatar?: string | undefined;
}>;
export type VerifyInput = z.infer<typeof verifySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=auth.validator.d.ts.map