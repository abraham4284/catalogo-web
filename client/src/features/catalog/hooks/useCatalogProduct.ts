import { useEffect, useState } from 'react'
import { getCatalogProductBySlug } from '../api/catalog.api'
import { CatalogError } from '../api/catalog.error'
import type { CatalogProductDetail } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'

export function useCatalogProduct(slug: string): CatalogRequestState<CatalogProductDetail> {
  const [result, setResult] = useState<{
    slug: string | undefined
    state: CatalogRequestState<CatalogProductDetail>
  }>({ slug: undefined, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getCatalogProductBySlug(slug, signal).then((data) => {
      if (!signal.aborted) setResult({ slug: slug, state: { status: 'success', data } })
    }).catch((error: unknown) => {
      if (signal.aborted) return
      if (error instanceof CatalogError && error.isCancelled) return
      if (error instanceof CatalogError && error.statusCode === 404) {
        setResult({ slug: slug, state: { status: 'error', reason: 'not-found', message: 'Producto no disponible' } })
        return
      }
      const message = getCatalogPresentationError(error)
      if (message) setResult({ slug: slug, state: { status: 'error', message } })
    })
    return () => controller.abort()
  }, [slug])

  return result.slug === slug ? result.state : { status: 'loading' }
}
