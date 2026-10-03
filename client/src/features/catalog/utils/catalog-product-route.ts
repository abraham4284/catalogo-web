import { catalogSlugSchema } from '../schemas/catalog.schemas'

export function parseCatalogProductSlugParam(value: string | undefined): string | undefined {
  const result = catalogSlugSchema.safeParse(value)
  return result.success ? result.data : undefined
}
