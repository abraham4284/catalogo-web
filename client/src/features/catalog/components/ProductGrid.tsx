import type { CatalogProductListItem } from '../types/catalog.types'
import type { ReactNode } from 'react'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products, renderActions }: {
  products: CatalogProductListItem[]; renderActions?: (product: CatalogProductListItem) => ReactNode
}) {
  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-8 min-[540px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:gap-x-6">
      {products.map((product) => <li key={product.idProduct} className="min-w-0"><ProductCard product={product} actions={renderActions?.(product)} /></li>)}
    </ul>
  )
}
