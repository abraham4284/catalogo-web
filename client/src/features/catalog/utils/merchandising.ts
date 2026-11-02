import type { CatalogProductListItem } from '../types/catalog.types'
export const FEATURED_HERO_PRODUCT_SLUG = 'lattafa-oud-for-glory'
type HeroItem = Pick<CatalogProductListItem, 'slug' | 'name' | 'imageUrl' | 'availabilityStatus'>
export function selectHeroProduct(items: readonly HeroItem[], candidate?: HeroItem) {
  const intended = items.find((item) => item.slug === FEATURED_HERO_PRODUCT_SLUG) ?? (candidate?.slug === FEATURED_HERO_PRODUCT_SLUG ? candidate : undefined)
  return intended?.imageUrl ? intended : items.find((item) => item.availabilityStatus === 'in_stock' && item.imageUrl)
}
export function selectRelatedProducts(items: readonly CatalogProductListItem[], current: { idProduct: number; slug: string; category: { slug: string } }) {
  const ids = new Set<number>(), slugs = new Set<string>()
  return items.filter((item) => {
    if (item.idProduct === current.idProduct || item.slug === current.slug || item.category.slug !== current.category.slug || ids.has(item.idProduct) || slugs.has(item.slug)) return false
    ids.add(item.idProduct); slugs.add(item.slug); return true
  }).slice(0, 8)
}
