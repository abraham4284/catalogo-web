import { getFeaturedHeroProduct, rememberCatalogProducts } from '../api/merchandising-cache'
import { FEATURED_HERO_PRODUCT_SLUG, selectHeroProduct } from '../utils/merchandising'
import { useEffect, useState } from 'react'
import { getCatalogCategories, getCatalogProducts } from '../api/catalog.api'
import type { CatalogCategory, CatalogProductsResponse } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'

type CatalogHomeData = {
  heroProduct?: ReturnType<typeof selectHeroProduct>
  heroLoading: boolean
  categories: CatalogCategory[]
  products: CatalogProductsResponse
}

export function useCatalogHome(): CatalogRequestState<CatalogHomeData> & { retry: () => void } {
  const [state, setState] = useState<CatalogRequestState<CatalogHomeData>>({ status: 'loading' })

  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    Promise.all([
      getCatalogCategories(signal),
      getCatalogProducts({ page: 1, limit: 8 }, signal),
    ]).then(([categories, products]) => {
      if (signal.aborted) return
      rememberCatalogProducts(products.items)
      const hasHero = products.items.length === 0 || products.items.some((item) => item.slug === FEATURED_HERO_PRODUCT_SLUG)
      setState({ status: 'success', data: { categories, products, heroProduct: selectHeroProduct(products.items), heroLoading: !hasHero } })
      if (!hasHero) {
        getFeaturedHeroProduct(signal).then((candidate) => {
          if (!signal.aborted) setState({ status: 'success', data: { categories, products, heroProduct: selectHeroProduct(products.items, candidate), heroLoading: false } })
        }).catch(() => {
          if (!signal.aborted) setState({ status: 'success', data: { categories, products, heroProduct: selectHeroProduct(products.items), heroLoading: false } })
        })
      }
    }).catch((error: unknown) => {
      const message = getCatalogPresentationError(error)
      if (!signal.aborted && message) setState({ status: 'error', message })
    })
    return () => controller.abort()
  }, [attempt])

  return { ...state, retry: () => { setState({ status: 'loading' }); setAttempt((n) => n + 1) } }
}
