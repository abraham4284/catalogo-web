import { useEffect, useState } from 'react'
import { getCatalogCategories, getCatalogProducts } from '../api/catalog.api'
import type { CatalogCategory, CatalogProductsResponse } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'
import type { CatalogFilters } from '../utils/catalog-url'

type CatalogListingState = {
  categories: CatalogRequestState<CatalogCategory[]>
  products: CatalogRequestState<CatalogProductsResponse>
}

export function useCatalogListing({ page, search, category }: CatalogFilters): CatalogListingState {
  const [categories, setCategories] = useState<CatalogRequestState<CatalogCategory[]>>({ status: 'loading' })
  const key = JSON.stringify([page, search, category])
  const [result, setResult] = useState<{ key: string; state: CatalogRequestState<CatalogProductsResponse> }>({
    key: '', state: { status: 'loading' },
  })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getCatalogCategories(signal).then((data) => {
      if (!signal.aborted) setCategories({ status: 'success', data })
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setCategories({ status: 'error', message })
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getCatalogProducts({ page, limit: 24, search, idProductCategory: category }, signal).then((data) => {
      if (!signal.aborted) setResult({ key, state: { status: 'success', data } })
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setResult({ key, state: { status: 'error', message } })
    })
    return () => controller.abort()
  }, [page, search, category, key])

  // Changed URL parameters immediately hide data belonging to an older request.
  return { categories, products: result.key === key ? result.state : { status: 'loading' } }
}
