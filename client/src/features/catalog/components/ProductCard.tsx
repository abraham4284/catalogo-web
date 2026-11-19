import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { CatalogProductListItem } from '../types/catalog.types'
import { ProductPrices } from './ProductPrices'
import { ProductCardImage } from './ProductCardImage'
import { ProductAvailabilityBadge } from './ProductAvailabilityBadge'

export function ProductCard({ product, actions }: { product: CatalogProductListItem; actions?: ReactNode }) {
  return (
    <article className="flex h-full min-w-0 flex-col bg-card">
      <Link to={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="flex min-w-0 flex-1 flex-col gap-3 p-1 sm:gap-5 focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2">
        <ProductCardImage imageUrl={product.imageUrl} secondaryImageUrl={product.secondaryImageUrl} name={product.name} availabilityStatus={product.availabilityStatus} stockAvailable={product.stockAvailable} />
        <div className="flex flex-1 flex-col gap-2 break-words sm:gap-3">
          <p className="line-clamp-1 min-h-4 text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="line-clamp-2 min-h-11 text-sm font-semibold sm:text-base leading-snug">{product.name}</h3>
          <div className="mt-auto space-y-2 sm:space-y-3">
            <ProductPrices priceSale={product.priceSale} priceWholesale={product.priceWholesale} />
            <div className="flex min-h-7 min-w-0 items-start [&>span]:max-w-full [&>span]:flex-wrap [&>span]:[overflow-wrap:anywhere]">
              {product.availabilityStatus !== 'out_of_stock' && <ProductAvailabilityBadge status={product.availabilityStatus} />}
            </div>
          </div>
        </div>
      </Link>
      {actions && <div className="mt-auto flex min-h-32 flex-col justify-end px-1 pb-1 pt-3 [&_button]:min-h-14 [&_button]:px-2 [&_button]:text-xs [&_a]:min-h-14 [&_a]:px-2 [&_a]:text-xs sm:pt-5 sm:[&_button]:min-h-11 sm:[&_button]:px-4 sm:[&_button]:text-sm sm:[&_a]:min-h-11 sm:[&_a]:px-4 sm:[&_a]:text-sm">{actions}</div>}
    </article>
  )
}
