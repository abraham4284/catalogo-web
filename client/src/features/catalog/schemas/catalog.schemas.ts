import { z } from 'zod'

export const catalogProductIdSchema = z.number().int().positive()

export const catalogBusinessSchema = z.object({
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().nullable(),
  businessType: z.string().nullable(),
})

export const catalogCategorySchema = z.object({
  idProductCategory: z.number().int().positive(),
  name: z.string(),
})

export const catalogProductCategorySchema = catalogCategorySchema

// El contrato no garantiza URLs absolutas: también se admiten rutas relativas.
export const catalogProductImageSchema = z.object({
  imageUrl: z.string(),
  altText: z.string().nullable(),
  sortOrder: z.number().int().nonnegative(),
})

export const catalogProductListItemSchema = z.object({
  idProduct: catalogProductIdSchema,
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  imageUrl: z.string().nullable(),
  category: catalogProductCategorySchema,
  available: z.boolean(),
})

export const catalogProductDetailSchema = catalogProductListItemSchema.extend({
  gallery: z.array(catalogProductImageSchema),
})

export const catalogPaginationSchema = z.object({
  page: z.number().int().positive(),
  currentPage: z.number().int().positive(),
  limit: z.number().int().min(1).max(60),
  total: z.number().int().nonnegative(),
  totalRecords: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
})

export const catalogProductsResponseSchema = z.object({
  items: z.array(catalogProductListItemSchema),
  pagination: catalogPaginationSchema,
})

export function catalogSuccessEnvelopeSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    status: z.literal(true),
    message: z.string(),
    data: dataSchema,
  })
}

export const catalogErrorEnvelopeSchema = z.object({
  status: z.literal(false),
  message: z.string(),
  errors: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
})

export const catalogProductsQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(60).optional(),
  search: z.string().trim().max(150).optional(),
  idProductCategory: z.number().int().positive().optional(),
}).transform((query) => {
  if (query.search === '') delete query.search
  for (const key of Object.keys(query) as (keyof typeof query)[]) {
    if (query[key] === undefined) delete query[key]
  }
  return query
})
