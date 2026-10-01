import { Link } from 'react-router-dom'
import type { CatalogProductListItem } from '../types/catalog.types'
import { formatCurrency } from '@/shared/utils/format-currency'
import { CatalogImage } from './CatalogImage'

export function ProductCard({ product }: { product: CatalogProductListItem }) {
  return (
    <article className="min-w-0">
      <Link to={`/productos/${product.idProduct}`} className="group block space-y-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
          <CatalogImage src={product.imageUrl} alt={product.name} loading="lazy" />
        </div>
        <div className="space-y-1 break-words">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="font-medium group-hover:underline underline-offset-4">{product.name}</h3>
          <p className="font-semibold">{formatCurrency(product.price)}</p>
          <p className="text-sm text-muted-foreground">{product.available ? 'Disponible' : 'No disponible'}</p>
        </div>
      </Link>
    </article>
  )
}
