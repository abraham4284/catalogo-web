import type { CatalogProductDetail } from '@/features/catalog'
import type { AddCartItemInput } from '@/features/cart'

export type CommerceProduct = Pick<CatalogProductDetail, 'idProduct' | 'slug' | 'name' | 'priceSale' | 'priceWholesale' | 'imageUrl' | 'availabilityStatus' | 'stockAvailable'>

export function toCartSnapshot(product: CommerceProduct): AddCartItemInput {
  const { idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable } = product
  return { idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable }
}
