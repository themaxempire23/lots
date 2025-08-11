import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .or(z.literal('').transform(() => undefined))
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});
