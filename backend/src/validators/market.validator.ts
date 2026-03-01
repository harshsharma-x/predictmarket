import { z } from 'zod';

export const createMarketSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters').max(500),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional(),
  resolutionSource: z.string().optional(),
  resolutionDate: z.string().datetime().or(z.string().transform((s) => new Date(s).toISOString())),
  featured: z.boolean().optional().default(false),
  contractAddress: z.string().optional(),
});

export const updateMarketSchema = createMarketSchema.partial().omit({ resolutionDate: true }).extend({
  resolutionDate: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
});

export const resolveMarketSchema = z.object({
  outcome: z.enum(['YES', 'NO']),
});

export const listMarketsSchema = z.object({
  category: z.string().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'RESOLVED', 'CANCELLED']).optional(),
  sort: z.enum(['newest', 'oldest', 'volume', 'closing_soon', 'featured']).optional().default('newest'),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
  search: z.string().optional(),
  featured: z.string().optional().transform((v) => v === 'true'),
});

export type CreateMarketInput = z.infer<typeof createMarketSchema>;
export type UpdateMarketInput = z.infer<typeof updateMarketSchema>;
export type ResolveMarketInput = z.infer<typeof resolveMarketSchema>;
export type ListMarketsInput = z.infer<typeof listMarketsSchema>;
