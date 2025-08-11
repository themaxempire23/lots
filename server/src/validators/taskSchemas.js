import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined))
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => typeof data.title !== 'undefined' || typeof data.description !== 'undefined',
  { message: 'At least one of title or description must be provided' }
);

// page, limit from query string
const toInt = (v, def) => {
  if (v === undefined || v === null || v === '') return def;
  const n = Number(v);
  return Number.isInteger(n) ? n : def;
};

export const listQuerySchema = z.object({
  page: z.any().transform((v) => Math.max(1, toInt(v, 1))),
  limit: z.any().transform((v) => {
    const val = toInt(v, 10);
    return Math.max(1, Math.min(100, val)); // cap at 100
  }),
  q: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined))
});
