import { getCatalogProductBySlug } from './catalog.api'
import type { CatalogProductDetail, CatalogProductListItem } from '../types/catalog.types'
import { FEATURED_HERO_PRODUCT_SLUG } from '../utils/merchandising'

let hero: { product: CatalogProductDetail; expires: number } | undefined
const pool = new Map<number, { product: CatalogProductListItem; expires: number }>()
const related = new Map<string, { items: CatalogProductListItem[]; expires: number }>()
export function rememberRelated(category: string, items: CatalogProductListItem[]) {
  related.set(category, { items, expires: Date.now() + 60_000 })
  while (related.size > 20) related.delete(related.keys().next().value!)
}
export function getRememberedRelated(category: string) {
  const entry = related.get(category)
  return entry && entry.expires > Date.now() ? entry.items : undefined
}
export function rememberCatalogProducts(items: readonly CatalogProductListItem[]) {
  for (const product of items) pool.set(product.idProduct, { product, expires: Date.now() + 60_000 })
  while (pool.size > 200) pool.delete(pool.keys().next().value!)
}
export function getRememberedProducts() {
  return [...pool.values()].filter((entry) => entry.expires > Date.now()).map((entry) => entry.product)
}
export async function getFeaturedHeroProduct(signal: AbortSignal) {
  if (hero && hero.expires > Date.now()) return hero.product
  const product = await getCatalogProductBySlug(FEATURED_HERO_PRODUCT_SLUG, signal)
  if (!signal.aborted) hero = { product, expires: Date.now() + 300_000 }
  return product
}
