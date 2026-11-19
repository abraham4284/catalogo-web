import { Link } from 'react-router-dom'
import type { CatalogProductDetail } from '../types/catalog.types'
import { getCatalogHref } from '../utils/catalog-url'

export function ProductBreadcrumbs({ product }: { product: Pick<CatalogProductDetail, 'name' | 'category'> }) {
  const links = [{ href: '/', name: 'Inicio' }, { href: '/productos', name: 'Productos' }, { href: getCatalogHref({ page: 1, categorySlug: product.category.slug }), name: product.category.name }]
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-h-11 min-w-0 items-center gap-1 text-xs sm:gap-2 sm:text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href} className="flex min-w-0 items-center gap-1 sm:gap-2">
            <Link to={link.href} title={link.name} className="inline-flex min-h-11 min-w-0 items-center hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><span className="max-w-[20vw] truncate sm:max-w-none">{link.name}</span></Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" title={product.name} className="min-w-0 flex-1 truncate text-foreground">{product.name}</li>
      </ol>
    </nav>
  )
}
