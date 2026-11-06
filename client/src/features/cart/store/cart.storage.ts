import type { PersistStorage } from 'zustand/middleware'
import { cartStorageEnvelopeSchema, legacyCartStorageSchema } from '../schemas/cart.schemas'
import type { PersistedCartState } from '../types/cart.types'

export function parsePersistedCart(raw: string | null): PersistedCartState {
  if (!raw) return { items: [] }
  try {
    const value: unknown = JSON.parse(raw)
    const parsed = cartStorageEnvelopeSchema.safeParse(value)
    if (parsed.success) return parsed.data.state
    const legacy = legacyCartStorageSchema.safeParse(value)
    return legacy.success ? { items: legacy.data.state.items.map(({ price, ...item }) => ({ ...item, priceSale: price, priceWholesale: null })) } : { items: [] }
  } catch {
    return { items: [] }
  }
}

export const cartStorage: PersistStorage<PersistedCartState> = {
  getItem(name) {
    try {
      return { state: parsePersistedCart(globalThis.localStorage.getItem(name)), version: 4 }
    } catch {
      return { state: { items: [] }, version: 4 }
    }
  },
  setItem(name, value) {
    try {
      globalThis.localStorage.setItem(name, JSON.stringify(value))
    } catch {
      // Storage can be unavailable or full; keep the in-memory cart usable.
    }
  },
  removeItem(name) {
    try {
      globalThis.localStorage.removeItem(name)
    } catch {
      // Storage access must not prevent cart interactions.
    }
  },
}
