import { z } from 'zod'

export const productRichContentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), level: z.union([z.literal(2), z.literal(3)]), text: z.string().max(150) }),
  z.object({ type: z.literal('paragraph'), text: z.string().max(3000) }),
  z.object({ type: z.literal('list'), style: z.enum(['bullet', 'numbered']), items: z.array(z.string().max(500)).min(1).max(30) }),
  z.object({ type: z.literal('specs'), items: z.array(z.object({ label: z.string().max(100), value: z.string().max(500) })).min(1).max(30) }),
])

export const productRichContentSchema = z.object({
  version: z.literal(1),
  blocks: z.array(productRichContentBlockSchema).max(30),
})
