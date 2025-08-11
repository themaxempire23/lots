import { z } from 'zod';

export const aiSuggestSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
  description: z.string().trim().max(2000).optional().or(z.literal('').transform(() => undefined))
}).refine((d) => typeof d.title !== 'undefined' || typeof d.description !== 'undefined', {
  message: 'Provide title or description'
});
