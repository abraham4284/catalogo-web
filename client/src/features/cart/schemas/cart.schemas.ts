import { z } from 'zod'

const positiveSafeInteger = z.number().int().positive().max(Number.MAX_SAFE_INTEGER)

export const addCartItemInputSchema = z.object({
  idProduct: positiveSafeInteger,
  name: z.string().trim().min(1),
  price: z.number().finite(),
  imageUrl: z.string().nullable(),
  available: z.boolean(),
  stockAvailable: z.number().int().nonnegative(),
})

export const cartItemSchema = addCartItemInputSchema.extend({ quantity: positiveSafeInteger })

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema).refine(
    (items) => new Set(items.map((item) => item.idProduct)).size === items.length,
  ),
})

export const cartStorageEnvelopeSchema = z.object({
  version: z.literal(2),
  state: cartStateSchema,
})
