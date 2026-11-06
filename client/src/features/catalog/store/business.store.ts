import { create } from 'zustand'
import { getCatalogBusiness } from '../api/catalog.api'
import type { CatalogBusiness } from '../types/catalog.types'

type BusinessState = {
  status: 'loading' | 'success' | 'error'
  business?: CatalogBusiness
}
const useBusinessStore = create<BusinessState>(() => ({ status: 'loading' }))
let pending: Promise<void> | undefined
let expires = 0

export function loadCatalogBusiness(force = false): Promise<void> {
  if (pending) return pending
  if (!force && Date.now() < expires) return Promise.resolve()
  useBusinessStore.setState({ status: 'loading', business: undefined })
  pending = getCatalogBusiness().then(business => {
    expires = Date.now() + 60_000
    useBusinessStore.setState({ status: 'success', business })
  }).catch(() => {
    // Policy failure must not prevent retail browsing or checkout.
    expires = Date.now() + 15_000
    useBusinessStore.setState({ status: 'error', business: undefined })
  }).finally(() => { pending = undefined })
  return pending
}

export function useCatalogPricing() {
  return useBusinessStore(state => state.business?.pricing)
}
export function useCatalogBusinessStatus() {
  return useBusinessStore(state => state.status)
}
