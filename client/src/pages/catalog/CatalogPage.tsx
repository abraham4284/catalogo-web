import { Navigate, useSearchParams } from 'react-router-dom'
import {
  useCatalogListing, readCatalogFilters, createCatalogSearchParams, getCatalogHref,
  CatalogSearch, CategoryFilter, CatalogPaginationControls, ProductGrid,
  CatalogLoadingState, CatalogErrorState, CatalogEmptyState,
} from '@/features/catalog'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readCatalogFilters(searchParams)
  const { categories, products: state } = useCatalogListing(filters)

  if (state.status === 'success' && filters.page > state.data.pagination.totalPages) {
    return <Navigate replace to={getCatalogHref({ ...filters, page: state.data.pagination.totalPages })} />
  }

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-3xl font-semibold">Productos</h1>
      <CatalogSearch search={filters.search} onSearch={(search) => setSearchParams(createCatalogSearchParams({ ...filters, search, page: 1 }))} />
      {categories.status === 'success' && <CategoryFilter categories={categories.data} filters={filters} />}
      {categories.status === 'error' && state.status !== 'error' && <CatalogErrorState message="No pudimos cargar las categorías. Podés seguir buscando productos." />}
      {state.status === 'loading' && <CatalogLoadingState />}
      {state.status === 'error' && <CatalogErrorState message={state.message} />}
      {state.status === 'success' && (
        <>
          <section aria-labelledby="catalog-results" className="space-y-6">
            <h2 id="catalog-results" className="break-words text-base font-medium">
              {filters.search ? `Resultados para “${filters.search}” · ` : ''}
              {state.data.pagination.totalRecords} productos
            </h2>
            {state.data.items.length > 0
              ? <ProductGrid products={state.data.items} />
              : <CatalogEmptyState filtered={Boolean(filters.search || filters.category)} />}
          </section>
          <CatalogPaginationControls currentPage={state.data.pagination.currentPage} totalPages={state.data.pagination.totalPages} filters={filters} />
        </>
      )}
    </div>
  )
}
