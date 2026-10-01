import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addCartItemInputSchema } from '../schemas/cart.schemas'
import type { AddCartItemInput, CartItem } from '../types/cart.types'
import { cartStorage } from './cart.storage'

type CartStore = {
  items: CartItem[]
  addItem: (input: AddCartItemInput) => void
  incrementItem: (idProduct: number) => void
  decrementItem: (idProduct: number) => void
  removeItem: (idProduct: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(persist((set) => ({
  items: [],
  addItem(input) {
    const result = addCartItemInputSchema.safeParse(input)
    if (!result.success) return
    const snapshot = result.data
    set((state) => ({
      items: state.items.some((item) => item.idProduct === snapshot.idProduct)
        ? state.items.map((item) => item.idProduct === snapshot.idProduct
          ? { ...snapshot, quantity: Math.min(item.quantity + 1, Number.MAX_SAFE_INTEGER) }
          : item)
        : [...state.items, { ...snapshot, quantity: 1 }],
    }))
  },
  incrementItem(idProduct) {
    set((state) => ({ items: state.items.map((item) => item.idProduct === idProduct
      ? { ...item, quantity: Math.min(item.quantity + 1, Number.MAX_SAFE_INTEGER) } : item) }))
  },
  decrementItem(idProduct) {
    set((state) => ({ items: state.items.map((item) => item.idProduct === idProduct
      ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item) }))
  },
  removeItem(idProduct) {
    set((state) => ({ items: state.items.filter((item) => item.idProduct !== idProduct) }))
  },
  clearCart() { set({ items: [] }) },
}), {
  name: 'catalogo-web-cart',
  version: 1,
  storage: cartStorage,
  partialize: (state) => ({ items: state.items }),
}))
