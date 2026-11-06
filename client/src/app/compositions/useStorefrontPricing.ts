import { useCartStore, calculateCartPricing } from '@/features/cart'
import { useCatalogPricing } from '@/features/catalog'

export function useStorefrontPricing() {
  const items = useCartStore(state => state.items)
  const policy = useCatalogPricing()
  return calculateCartPricing(items, policy)
}
