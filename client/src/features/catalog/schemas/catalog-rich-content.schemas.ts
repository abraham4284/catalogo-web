import { z } from 'zod'

export const productRichContentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), level: z.union([z.literal(2), z.literal(3)]), text: z.string() }),
  z.object({ type: z.literal('paragraph'), text: z.string() }),
  z.object({ type: z.literal('list'), style: z.enum(['bullet', 'numbered']), items: z.array(z.string()) }),
  z.object({ type: z.literal('specs'), items: z.array(z.object({ label: z.string(), value: z.string() })) }),
])

export const productRichContentSchema = z.object({
  version: z.literal(1),
  blocks: z.array(productRichContentBlockSchema),
})
