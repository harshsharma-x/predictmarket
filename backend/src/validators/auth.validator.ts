import { z } from 'zod';

export const verifySchema = z.object({
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required'),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
    .optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});

export type VerifyInput = z.infer<typeof verifySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
