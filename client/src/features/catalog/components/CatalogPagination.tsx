import { Link } from 'react-router-dom'
import { getCatalogHref } from '../utils/catalog-url'
import type { CatalogFilters } from '../utils/catalog-url'

type CatalogPaginationProps = { currentPage: number; totalPages: number; filters: CatalogFilters }

export function CatalogPagination({ currentPage, totalPages, filters }: CatalogPaginationProps) {
  if (totalPages <= 1) return null
  const linkClasses = 'px-2 py-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring'
  return (
    <nav aria-label="Paginación de productos" className="flex flex-wrap items-center justify-center gap-3 text-sm sm:gap-6">
      {currentPage > 1 ? <Link to={getCatalogHref({ ...filters, page: currentPage - 1 })} className={linkClasses}>Anterior</Link> : <span aria-disabled="true" className="px-2 py-2 text-muted-foreground">Anterior</span>}
      <span>Página {currentPage} de {totalPages}</span>
      {currentPage < totalPages ? <Link to={getCatalogHref({ ...filters, page: currentPage + 1 })} className={linkClasses}>Siguiente</Link> : <span aria-disabled="true" className="px-2 py-2 text-muted-foreground">Siguiente</span>}
    </nav>
  )
}
