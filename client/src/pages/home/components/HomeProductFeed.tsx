import { Link } from 'react-router-dom'
import { ProductCard, ProductCardSkeleton, type CatalogCategory, type CatalogProductListItem } from '@/features/catalog'
import { ProductCommerceActions } from '@/app/compositions/ProductCommerceActions'
import { HomeCategories } from './HomeCategories'

const PRODUCTS_BEFORE_CATEGORIES = 8

export function HomeProductFeed({ products, categories, loading = false }: {
  products: readonly CatalogProductListItem[]
  categories: readonly CatalogCategory[]
  loading?: boolean
}) {
  const ids = new Set<number>()
  const slugs = new Set<string>()
  const uniqueProducts = products.filter(({ idProduct, slug }) => {
    if (ids.has(idProduct) || slugs.has(slug)) return false
    ids.add(idProduct)
    slugs.add(slug)
    return true
  })
  const items = loading ? Array.from({ length: 12 }, () => undefined) : uniqueProducts
  const insertion = Math.min(PRODUCTS_BEFORE_CATEGORIES, items.length)
  const categoryItem = (
    <li key="categories" className="col-span-full min-w-0 py-2">
      {loading ? <div aria-hidden="true" className="space-y-4">
        <div className="h-9 w-56 max-w-full rounded bg-muted motion-safe:animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((index) => <div key={index} className="min-h-44 rounded-xl bg-accent motion-safe:animate-pulse lg:min-h-54" />)}</div>
      </div> : <HomeCategories categories={categories} />}
    </li>
  )

  return (
    <div className="space-y-5">
      {loading && <p role="status" className="sr-only">Cargando productos…</p>}
      <ul aria-label="Productos y categorías" className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
        {items.flatMap((product, index) => {
          const card = (
            <li key={product ? `product-${product.idProduct}` : `skeleton-${index}`} className="min-w-0" aria-hidden={loading || undefined}>
              {product ? <ProductCard product={product} actions={<ProductCommerceActions product={product} />} /> : <ProductCardSkeleton />}
            </li>
          )
          return index + 1 === insertion && (loading || categories.length > 0) ? [card, categoryItem] : [card]
        })}
        {items.length === 0 && categories.length > 0 && categoryItem}
      </ul>
      {!loading && <Link to="/productos" className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Seguí explorando el catálogo →</Link>}
    </div>
  )
}
