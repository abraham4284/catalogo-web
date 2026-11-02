import { rememberCatalogProducts } from '../api/merchandising-cache'
import { useEffect, useState } from 'react'
import { getCatalogCategories, getCatalogProducts } from '../api/catalog.api'
import type { CatalogCategory, CatalogProductsResponse } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'
import type { CatalogFilters } from '../utils/catalog-url'

type CatalogListingState = {
  categories: CatalogRequestState<CatalogCategory[]>
  products: CatalogRequestState<CatalogProductsResponse>
  retry: () => void
}

export function useCatalogListing({ page, search, categorySlug }: CatalogFilters): CatalogListingState {
  const [categories, setCategories] = useState<CatalogRequestState<CatalogCategory[]>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const key = JSON.stringify([page, search, categorySlug])
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
    getCatalogProducts({ page, limit: 24, search, categorySlug }, signal).then((data) => {
      if (!signal.aborted) { rememberCatalogProducts(data.items); setResult({ key, state: { status: 'success', data } }) }
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setResult({ key, state: { status: 'error', message } })
    })
    return () => controller.abort()
  }, [page, search, categorySlug, key, attempt])

  // Changed URL parameters immediately hide data belonging to an older request.
  return { retry: () => { setResult({ key, state: { status: 'loading' } }); setAttempt((n) => n + 1) }, categories, products: result.key === key ? result.state : { status: 'loading' } }
}
