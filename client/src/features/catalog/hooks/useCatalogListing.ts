import { useEffect, useState } from 'react'
import { getCatalogCategories, getCatalogProducts } from '../api/catalog.api'
import type { CatalogCategory, CatalogProductsResponse } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'
import type { CatalogFilters } from '../utils/catalog-url'

type CatalogListingData = { categories: CatalogCategory[]; products: CatalogProductsResponse }

export function useCatalogListing({ page, search, category }: CatalogFilters): CatalogRequestState<CatalogListingData> {
  const key = JSON.stringify([page, search, category])
  const [result, setResult] = useState<{ key: string; state: CatalogRequestState<CatalogListingData> }>({
    key: '', state: { status: 'loading' },
  })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    Promise.all([
      getCatalogCategories(signal),
      getCatalogProducts({ page, limit: 24, search, idProductCategory: category }, signal),
    ]).then(([categories, products]) => {
      if (!signal.aborted) setResult({ key, state: { status: 'success', data: { categories, products } } })
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setResult({ key, state: { status: 'error', message } })
    })
    return () => controller.abort()
  }, [page, search, category, key])

  // Changed URL parameters immediately hide data belonging to an older request.
  return result.key === key ? result.state : { status: 'loading' }
}
