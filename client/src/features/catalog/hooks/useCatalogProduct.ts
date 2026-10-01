import { useEffect, useState } from 'react'
import { getCatalogProductById } from '../api/catalog.api'
import { CatalogError } from '../api/catalog.error'
import type { CatalogProductDetail } from '../types/catalog.types'
import type { CatalogRequestState } from '../types/catalog-request.types'
import { getCatalogPresentationError } from '../utils/catalog-presentation-error'

export function useCatalogProduct(idProduct: number): CatalogRequestState<CatalogProductDetail> {
  const [result, setResult] = useState<{
    id: number | undefined
    state: CatalogRequestState<CatalogProductDetail>
  }>({ id: undefined, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getCatalogProductById(idProduct, signal).then((data) => {
      if (!signal.aborted) setResult({ id: idProduct, state: { status: 'success', data } })
    }).catch((error: unknown) => {
      if (signal.aborted) return
      if (error instanceof CatalogError && error.isCancelled) return
      if (error instanceof CatalogError && error.code === 'HTTP' && error.statusCode === 404) {
        setResult({ id: idProduct, state: { status: 'error', reason: 'not-found', message: 'Producto no disponible' } })
        return
      }
      const message = getCatalogPresentationError(error)
      if (message) setResult({ id: idProduct, state: { status: 'error', message } })
    })
    return () => controller.abort()
  }, [idProduct])

  return result.id === idProduct ? result.state : { status: 'loading' }
}
