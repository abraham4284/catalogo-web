import { create } from 'zustand'

type StorePanel = 'cart' | 'menu' | null

type StorefrontUi = {
  panel: StorePanel
  contentPanel: Exclude<StorePanel, null>
  hasOpened: boolean
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
  hasOpened: false,
  returnFocus: null,
  openCart: (trigger) => set({ panel: 'cart', contentPanel: 'cart', returnFocus: trigger, hasOpened: true }),
  openMenu: (trigger) => set({ panel: 'menu', contentPanel: 'menu', returnFocus: trigger, hasOpened: true }),
  closePanel: () => set({ panel: null }),
  closeForNavigation: () => set({ panel: null, returnFocus: null }),
}))
