import { Link } from 'react-router-dom'
import type { CatalogCategory } from '../types/catalog.types'
import { getCatalogHref } from '../utils/catalog-url'
import type { CatalogFilters } from '../utils/catalog-url'

type CategoryFilterProps = { categories: CatalogCategory[]; filters: CatalogFilters }

export function CategoryFilter({ categories, filters }: CategoryFilterProps) {
  const options = [{ idProductCategory: undefined, slug: undefined, name: 'Todos' }, ...categories]
  return (
    <nav aria-label="Filtrar por categoría" className="min-w-0 overflow-x-auto py-2">
      <ul className="flex w-max gap-2 px-1 py-1">
        {options.map((category) => (
          <li key={category.idProductCategory ?? 'all'}>
            <Link to={getCatalogHref({ ...filters, page: 1, categorySlug: category.slug })} aria-current={filters.categorySlug === category.slug ? 'true' : undefined} className="block whitespace-nowrap border px-4 py-2 text-sm aria-[current=true]:bg-primary aria-[current=true]:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
