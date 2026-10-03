import { Link } from 'react-router-dom'
import type { CatalogProductDetail } from '../types/catalog.types'
import { getCatalogHref } from '../utils/catalog-url'

export function ProductBreadcrumbs({ product }: { product: Pick<CatalogProductDetail, 'name' | 'category'> }) {
  const links = [{ href: '/', name: 'Inicio' }, { href: '/productos', name: 'Productos' }, { href: getCatalogHref({ page: 1, categorySlug: product.category.slug }), name: product.category.name }]
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href} className="flex min-w-0 items-center gap-2">
            <Link to={link.href} className="inline-flex min-h-11 items-center break-words hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{link.name}</Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="min-w-0 break-words text-foreground">{product.name}</li>
      </ol>
    </nav>
  )
}
