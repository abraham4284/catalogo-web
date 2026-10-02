import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addCartItemInputSchema } from '../schemas/cart.schemas'
import type { AddCartItemInput, CartItem } from '../types/cart.types'
import { cartStorage } from './cart.storage'
import { canIncrementCartItem, isCartItemAvailable } from '../domain/cart'

type CartStore = {
  items: CartItem[]
  addItem: (input: AddCartItemInput) => void
  reconcileItem: (snapshot: AddCartItemInput) => void
  incrementItem: (idProduct: number) => void
  decrementItem: (idProduct: number) => void
  removeItem: (idProduct: number) => void
  clearCart: () => void
}

function hasSameSnapshot(item: CartItem, snapshot: AddCartItemInput): boolean {
  return item.name === snapshot.name && item.price === snapshot.price && item.imageUrl === snapshot.imageUrl
    && item.available === snapshot.available && item.stockAvailable === snapshot.stockAvailable
}

export const useCartStore = create<CartStore>()(persist((set, get) => ({
  items: [],
  addItem(input) {
    const result = addCartItemInputSchema.safeParse(input)
    if (!result.success) return
    const snapshot = result.data
    if (!isCartItemAvailable(snapshot)) return
    set((state) => ({
      items: state.items.some((item) => item.idProduct === snapshot.idProduct)
        ? state.items.map((item) => item.idProduct === snapshot.idProduct
          ? { ...snapshot, quantity: item.quantity < snapshot.stockAvailable ? item.quantity + 1 : item.quantity }
          : item)
        : [...state.items, { ...snapshot, quantity: 1 }],
    }))
  },
  reconcileItem(input) {
    const result = addCartItemInputSchema.safeParse(input)
    if (!result.success) return
    const snapshot = result.data
    const existing = get().items.find((item) => item.idProduct === snapshot.idProduct)
    if (!existing || hasSameSnapshot(existing, snapshot)) return
    // Preserve quantity so a stock decrease stays visible instead of silently changing the cart.
    set((state) => ({ items: state.items.map((item) => item.idProduct === snapshot.idProduct
      ? { ...snapshot, quantity: item.quantity } : item) }))
  },
  incrementItem(idProduct) {
    const existing = get().items.find((item) => item.idProduct === idProduct)
    if (!existing || !canIncrementCartItem(existing)) return
    set((state) => ({ items: state.items.map((item) => item.idProduct === idProduct
      ? { ...item, quantity: item.quantity + 1 } : item) }))
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
  version: 2,
  storage: cartStorage,
  partialize: (state) => ({ items: state.items }),
}))
