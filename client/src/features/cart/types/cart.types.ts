import type { z } from 'zod'
import type { addCartItemInputSchema, cartItemSchema, cartStateSchema } from '../schemas/cart.schemas'

export type CartItem = z.infer<typeof cartItemSchema>
export type AddCartItemInput = z.infer<typeof addCartItemInputSchema>
export type PersistedCartState = z.infer<typeof cartStateSchema>
