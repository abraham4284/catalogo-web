import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { CatalogProductListItem } from '../types/catalog.types'
import { formatCurrency } from '@/shared/utils/format-currency'
import { ProductCardImage } from './ProductCardImage'
import { ProductAvailabilityBadge } from './ProductAvailabilityBadge'

export function ProductCard({ product, actions }: { product: CatalogProductListItem; actions?: ReactNode }) {
  const description = product.description?.trim()
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
      <Link to={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`} className="block min-w-0 space-y-4 p-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:-outline-offset-2">
        <ProductCardImage imageUrl={product.imageUrl} secondaryImageUrl={product.secondaryImageUrl} name={product.name} />
        <div className="space-y-3 break-words">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="text-base font-semibold leading-snug">{product.name}</h3>
          {description && <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>}
          <p className="text-xl font-semibold tracking-tight">{formatCurrency(product.price)}</p>
          <ProductAvailabilityBadge status={product.availabilityStatus} />
        </div>
      </Link>
      {actions && <div className="mt-auto border-t p-4">{actions}</div>}
    </article>
  )
}
