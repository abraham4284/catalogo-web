import { create } from 'zustand'

type StorePanel = 'cart' | 'menu' | null

type StorefrontUi = {
  panel: StorePanel
  contentPanel: Exclude<StorePanel, null>
  returnFocus: HTMLElement | null
  openCart: (trigger: HTMLElement) => void
  openMenu: (trigger: HTMLElement) => void
  closePanel: () => void
  closeForNavigation: () => void
}

// UI only: never persisted with the commercial cart snapshot.
export const useStorefrontUi = create<StorefrontUi>((set) => ({
  panel: null,
  contentPanel: 'cart',
  returnFocus: null,
  openCart: (trigger) => set({ panel: 'cart', contentPanel: 'cart', returnFocus: trigger }),
  openMenu: (trigger) => set({ panel: 'menu', contentPanel: 'menu', returnFocus: trigger }),
  closePanel: () => set({ panel: null }),
  closeForNavigation: () => set({ panel: null, returnFocus: null }),
}))
