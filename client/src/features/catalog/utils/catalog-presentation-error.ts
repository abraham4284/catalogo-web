import { CatalogError } from '../api/catalog.error'

export function getCatalogPresentationError(error: unknown): string | undefined {
  if (error instanceof CatalogError) {
    if (error.isCancelled) return undefined
    if (error.code === 'NETWORK') return 'No pudimos conectarnos con el catálogo. Intentá nuevamente.'
    if (error.code === 'HTTP' && error.statusCode === 404) return 'El catálogo no está disponible en este momento.'
  }
  return 'No pudimos cargar la información del catálogo.'
}
