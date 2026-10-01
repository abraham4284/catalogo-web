import axios from 'axios'
import { z } from 'zod'
import { catalogErrorEnvelopeSchema } from '../schemas/catalog.schemas'
import type { CatalogFieldError } from '../types/catalog.types'

export type CatalogErrorCode = 'NETWORK' | 'HTTP' | 'INVALID_RESPONSE' | 'INVALID_INPUT'

type CatalogErrorDetails = {
  statusCode?: number
  fieldErrors?: CatalogFieldError[]
  isCancelled?: boolean
}

export class CatalogError extends Error {
  readonly code: CatalogErrorCode
  readonly statusCode?: number
  readonly fieldErrors?: CatalogFieldError[]
  readonly isCancelled: boolean

  constructor(code: CatalogErrorCode, message: string, details: CatalogErrorDetails = {}) {
    super(message)
    this.name = 'CatalogError'
    this.code = code
    this.statusCode = details.statusCode
    this.fieldErrors = details.fieldErrors
    this.isCancelled = details.isCancelled ?? false
  }
}

export function parseCatalogBackendError(body: unknown, statusCode: number): CatalogError | undefined {
  const result = catalogErrorEnvelopeSchema.safeParse(body)
  if (!result.success) return undefined

  return new CatalogError('HTTP', result.data.message, {
    statusCode,
    fieldErrors: result.data.errors,
  })
}

export function normalizeCatalogError(error: unknown): CatalogError {
  if (error instanceof CatalogError) return error

  if (error instanceof z.ZodError) {
    return new CatalogError('INVALID_INPUT', 'Los parámetros del catálogo no son válidos.', {
      fieldErrors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (axios.isCancel(error)) {
    return new CatalogError('NETWORK', 'Solicitud cancelada.', { isCancelled: true })
  }

  if (axios.isAxiosError<unknown>(error)) {
    if (!error.response) {
      return new CatalogError('NETWORK', 'No se pudo conectar con el catálogo.')
    }

    const { data, status } = error.response
    return parseCatalogBackendError(data, status)
      ?? new CatalogError('INVALID_RESPONSE', 'La respuesta del catálogo no es válida.', { statusCode: status })
  }

  return new CatalogError('INVALID_RESPONSE', 'No se pudo procesar la respuesta del catálogo.')
}
