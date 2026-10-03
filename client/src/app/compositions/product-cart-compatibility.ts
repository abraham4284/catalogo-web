import type { CatalogProductDetail } from '@/features/catalog'
import type { AddCartItemInput } from '@/features/cart'

export type CommerceProduct = Pick<CatalogProductDetail, 'idProduct' | 'name' | 'price' | 'imageUrl' | 'availabilityStatus' | 'stockAvailable'>

// Puente temporal hacia el snapshot v2; se retira con la migración F10B.
export function toCartV2Snapshot(product: CommerceProduct): AddCartItemInput {
  const { idProduct, name, price, imageUrl, stockAvailable, availabilityStatus } = product
  return { idProduct, name, price, imageUrl, stockAvailable, available: availabilityStatus === 'in_stock' }
}
