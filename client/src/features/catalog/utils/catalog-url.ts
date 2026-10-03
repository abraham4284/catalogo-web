import { catalogSlugSchema } from '../schemas/catalog.schemas'

export type CatalogFilters = { page: number; search?: string; categorySlug?: string }

function readPositiveInteger(value: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? number : undefined
}

export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  const search = (params.get('search') ?? '').trim().slice(0, 150)
  return {
    page: readPositiveInteger(params.get('page')) ?? 1,
    categorySlug: readCategorySlug(params.get('categoria')),
    search: search || undefined,
  }
}

export function createCatalogSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams()
  const search = filters.search?.trim().slice(0, 150)
  if (search) params.set('search', search)
  const categorySlug = readCategorySlug(filters.categorySlug)
  if (categorySlug) params.set('categoria', categorySlug)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

export function getCatalogHref(filters: CatalogFilters): string {
  const query = createCatalogSearchParams(filters).toString()
  return query ? `/productos?${query}` : '/productos'
}

function readCategorySlug(value: unknown): string | undefined {
  const result = catalogSlugSchema.safeParse(value)
  return result.success ? result.data : undefined
}
