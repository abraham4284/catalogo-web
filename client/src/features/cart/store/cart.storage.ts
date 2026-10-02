import type { PersistStorage } from 'zustand/middleware'
import { cartStorageEnvelopeSchema } from '../schemas/cart.schemas'
import type { PersistedCartState } from '../types/cart.types'

export function parsePersistedCart(raw: string | null): PersistedCartState {
  if (!raw) return { items: [] }
  try {
    const parsed = cartStorageEnvelopeSchema.safeParse(JSON.parse(raw) as unknown)
    return parsed.success ? parsed.data.state : { items: [] }
  } catch {
    return { items: [] }
  }
}

export const cartStorage: PersistStorage<PersistedCartState> = {
  getItem(name) {
    try {
      return { state: parsePersistedCart(globalThis.localStorage.getItem(name)), version: 2 }
    } catch {
      return { state: { items: [] }, version: 2 }
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
