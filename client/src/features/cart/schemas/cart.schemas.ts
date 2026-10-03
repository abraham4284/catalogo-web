import { z } from 'zod'
import { publicSlugSchema } from '@/shared/schemas/public-slug'

const positiveSafeInteger = z.number().int().positive().max(Number.MAX_SAFE_INTEGER)
export const cartAvailabilityStatusSchema = z.enum(['in_stock', 'out_of_stock', 'on_order'])

export const addCartItemInputSchema = z.object({
  idProduct: positiveSafeInteger,
  slug: publicSlugSchema,
  name: z.string().trim().min(1),
  price: z.number().finite(),
  imageUrl: z.string().nullable(),
  availabilityStatus: cartAvailabilityStatusSchema,
  stockAvailable: z.number().int().nonnegative(),
})

export const cartItemSchema = addCartItemInputSchema.extend({ quantity: positiveSafeInteger })

export const cartStateSchema = z.object({
  items: z.array(cartItemSchema).refine(
    (items) => new Set(items.map((item) => item.idProduct)).size === items.length
      && new Set(items.map((item) => item.slug)).size === items.length,
  ),
})

export const cartStorageEnvelopeSchema = z.object({
  version: z.literal(3),
  state: cartStateSchema,
})
