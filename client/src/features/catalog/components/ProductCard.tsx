import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { CatalogProductListItem } from '../types/catalog.types'
import { ProductPrices } from './ProductPrices'
import { ProductCardImage } from './ProductCardImage'
import { ProductAvailabilityBadge } from './ProductAvailabilityBadge'

export function ProductCard({ product, actions }: { product: CatalogProductListItem; actions?: ReactNode }) {
  return (
    <article className="flex h-full min-w-0 flex-col bg-card">
      <Link to={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="flex min-w-0 flex-1 flex-col gap-5 p-1 focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2">
        <ProductCardImage imageUrl={product.imageUrl} secondaryImageUrl={product.secondaryImageUrl} name={product.name} />
        <div className="flex flex-1 flex-col gap-3 break-words">
          <p className="line-clamp-1 min-h-4 text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="line-clamp-2 min-h-11 text-base font-semibold leading-snug">{product.name}</h3>
          <div className="mt-auto space-y-3">
            <ProductPrices priceSale={product.priceSale} priceWholesale={product.priceWholesale} />
            <ProductAvailabilityBadge status={product.availabilityStatus} />
          </div>
        </div>
      </Link>
      {actions && <div className="mt-auto flex min-h-32 flex-col justify-end px-1 pb-1 pt-5">{actions}</div>}
    </article>
  )
}
