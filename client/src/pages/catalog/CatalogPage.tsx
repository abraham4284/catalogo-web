import { useSearchParams } from 'react-router-dom'
import {
  useCatalogListing, readCatalogFilters, createCatalogSearchParams,
  CatalogSearch, CategoryFilter, CatalogPaginationControls, ProductGrid,
  CatalogLoadingState, CatalogErrorState, CatalogEmptyState,
} from '@/features/catalog'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readCatalogFilters(searchParams)
  const state = useCatalogListing(filters)

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="text-3xl font-semibold">Productos</h1>
      <CatalogSearch search={filters.search} onSearch={(search) => setSearchParams(createCatalogSearchParams({ ...filters, search, page: 1 }))} />
      {state.status === 'loading' && <CatalogLoadingState />}
      {state.status === 'error' && <CatalogErrorState message={state.message} />}
      {state.status === 'success' && (
        <>
          <CategoryFilter categories={state.data.categories} filters={filters} />
          <section aria-labelledby="catalog-results" className="space-y-6">
            <h2 id="catalog-results" className="break-words text-base font-medium">
              {filters.search ? `Resultados para “${filters.search}” · ` : ''}
              {state.data.products.pagination.totalRecords} productos
            </h2>
            {state.data.products.items.length > 0
              ? <ProductGrid products={state.data.products.items} />
              : <CatalogEmptyState filtered={Boolean(filters.search || filters.category)} />}
          </section>
          <CatalogPaginationControls currentPage={state.data.products.pagination.currentPage} totalPages={state.data.products.pagination.totalPages} filters={filters} />
        </>
      )}
    </div>
  )
}
