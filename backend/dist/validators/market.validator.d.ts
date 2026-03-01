import { z } from 'zod';
export declare const createMarketSchema: z.ZodObject<{
    question: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    resolutionSource: z.ZodOptional<z.ZodString>;
    resolutionDate: z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodString, string, string>]>;
    featured: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    contractAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    question: string;
    description: string;
    category: string;
    resolutionDate: string;
    featured: boolean;
    imageUrl?: string | undefined;
    resolutionSource?: string | undefined;
    contractAddress?: string | undefined;
}, {
    question: string;
    description: string;
    category: string;
    resolutionDate: string;
    imageUrl?: string | undefined;
    resolutionSource?: string | undefined;
    featured?: boolean | undefined;
    contractAddress?: string | undefined;
}>;
export declare const updateMarketSchema: z.ZodObject<Omit<{
    question: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    resolutionSource: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    resolutionDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodEffects<z.ZodString, string, string>]>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    contractAddress: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "resolutionDate"> & {
    resolutionDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "PAUSED", "CANCELLED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "PAUSED" | "CANCELLED" | undefined;
    question?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    imageUrl?: string | undefined;
    resolutionSource?: string | undefined;
    resolutionDate?: string | undefined;
    featured?: boolean | undefined;
    contractAddress?: string | undefined;
}, {
    status?: "ACTIVE" | "PAUSED" | "CANCELLED" | undefined;
    question?: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    imageUrl?: string | undefined;
    resolutionSource?: string | undefined;
    resolutionDate?: string | undefined;
    featured?: boolean | undefined;
    contractAddress?: string | undefined;
}>;
export declare const resolveMarketSchema: z.ZodObject<{
    outcome: z.ZodEnum<["YES", "NO"]>;
}, "strip", z.ZodTypeAny, {
    outcome: "YES" | "NO";
}, {
    outcome: "YES" | "NO";
}>;
export declare const listMarketsSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "PAUSED", "RESOLVED", "CANCELLED"]>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<["newest", "oldest", "volume", "closing_soon", "featured"]>>>;
    page: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, number, string | undefined>;
    limit: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodString>>, number, string | undefined>;
    search: z.ZodOptional<z.ZodString>;
    featured: z.ZodEffects<z.ZodOptional<z.ZodString>, boolean, string | undefined>;
}, "strip", z.ZodTypeAny, {
    sort: "featured" | "newest" | "oldest" | "volume" | "closing_soon";
    limit: number;
    featured: boolean;
    page: number;
    status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "RESOLVED" | undefined;
    search?: string | undefined;
    category?: string | undefined;
}, {
    status?: "ACTIVE" | "PAUSED" | "CANCELLED" | "RESOLVED" | undefined;
    sort?: "featured" | "newest" | "oldest" | "volume" | "closing_soon" | undefined;
    limit?: string | undefined;
    search?: string | undefined;
    category?: string | undefined;
    featured?: string | undefined;
    page?: string | undefined;
}>;
export type CreateMarketInput = z.infer<typeof createMarketSchema>;
export type UpdateMarketInput = z.infer<typeof updateMarketSchema>;
export type ResolveMarketInput = z.infer<typeof resolveMarketSchema>;
export type ListMarketsInput = z.infer<typeof listMarketsSchema>;
//# sourceMappingURL=market.validator.d.ts.map