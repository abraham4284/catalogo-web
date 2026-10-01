import { useEffect, useState } from 'react'
import { getCatalogBusiness, getCatalogCategories, getCatalogProducts } from '../api/catalog.api'
import type { CatalogBusiness, CatalogCategory, CatalogProductsResponse } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'

type CatalogHomeData = {
  business: CatalogBusiness
  categories: CatalogCategory[]
  products: CatalogProductsResponse
}

export function useCatalogHome(): CatalogRequestState<CatalogHomeData> {
  const [state, setState] = useState<CatalogRequestState<CatalogHomeData>>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    Promise.all([
      getCatalogBusiness(signal),
      getCatalogCategories(signal),
      getCatalogProducts({ page: 1, limit: 8 }, signal),
    ]).then(([business, categories, products]) => {
      if (!signal.aborted) setState({ status: 'success', data: { business, categories, products } })
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setState({ status: 'error', message })
    })
    return () => controller.abort()
  }, [])

  return state
}
