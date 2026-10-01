import { z } from 'zod'

const positiveSafeInteger = z.number().int().positive().max(Number.MAX_SAFE_INTEGER)

export const addCartItemInputSchema = z.object({
  idProduct: positiveSafeInteger,
  name: z.string().trim().min(1),
  price: z.number().finite(),
})

export const cartItemSchema = addCartItemInputSchema.extend({ quantity: positiveSafeInteger })

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema).refine(
    (items) => new Set(items.map((item) => item.idProduct)).size === items.length,
  ),
})

export const cartStorageEnvelopeSchema = z.object({
  version: z.literal(1),
  state: cartStateSchema,
})
