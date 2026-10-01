import { z } from 'zod'
import { getCatalogHttp } from '@/shared/api/catalog-http'
import {
  catalogBusinessSchema,
  catalogCategorySchema,
  catalogProductDetailSchema,
  catalogProductIdSchema,
  catalogProductsQuerySchema,
  catalogProductsResponseSchema,
  catalogSuccessEnvelopeSchema,
} from '../schemas/catalog.schemas'
import type {
  CatalogBusiness,
  CatalogCategory,
  CatalogProductDetail,
  CatalogProductsQuery,
  CatalogProductsResponse,
} from '../types/catalog.types'
import { CatalogError, normalizeCatalogError, parseCatalogBackendError } from './catalog.error'

async function requestCatalog<T>(
  path: string,
  schema: z.ZodType<T>,
  params?: CatalogProductsQuery,
  signal?: AbortSignal,
): Promise<T> {
  try {
    const http = getConfiguredCatalogHttp()
    const response = await http.get<unknown>(path, { params, signal })
    const backendError = parseCatalogBackendError(response.data, response.status)
    if (backendError) throw backendError

    const result = catalogSuccessEnvelopeSchema(schema).safeParse(response.data)
    if (!result.success) {
      throw new CatalogError('INVALID_RESPONSE', 'La respuesta del catálogo no es válida.', {
        statusCode: response.status,
      })
    }

    return result.data.data
  } catch (error: unknown) {
    throw normalizeCatalogError(error)
  }
}

function getConfiguredCatalogHttp() {
  try {
    return getCatalogHttp()
  } catch {
    throw new CatalogError('INVALID_INPUT', 'La URL de la API de catálogo no está configurada correctamente.')
  }
}

export function getCatalogBusiness(signal?: AbortSignal): Promise<CatalogBusiness> {
  return requestCatalog('/catalog', catalogBusinessSchema, undefined, signal)
}

export function getCatalogCategories(signal?: AbortSignal): Promise<CatalogCategory[]> {
  return requestCatalog('/catalog/categories', z.array(catalogCategorySchema), undefined, signal)
}

export async function getCatalogProducts(
  query: CatalogProductsQuery = {},
  signal?: AbortSignal,
): Promise<CatalogProductsResponse> {
  try {
    const params = catalogProductsQuerySchema.parse(query)
    return await requestCatalog('/catalog/products', catalogProductsResponseSchema, params, signal)
  } catch (error: unknown) {
    throw normalizeCatalogError(error)
  }
}

export async function getCatalogProductById(idProduct: number, signal?: AbortSignal): Promise<CatalogProductDetail> {
  try {
    const validId = catalogProductIdSchema.parse(idProduct)
    return await requestCatalog(`/catalog/products/${validId}`, catalogProductDetailSchema, undefined, signal)
  } catch (error: unknown) {
    throw normalizeCatalogError(error)
  }
}
