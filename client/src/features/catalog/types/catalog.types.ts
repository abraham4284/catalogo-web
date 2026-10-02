import type { z } from 'zod'
import type { productRichContentSchema, productRichContentBlockSchema } from '../schemas/catalog-rich-content.schemas'
import type {
  catalogBusinessSchema,
  catalogCategorySchema,
  catalogProductCategorySchema,
  catalogProductImageSchema,
  catalogProductListItemSchema,
  catalogProductDetailSchema,
  catalogPaginationSchema,
  catalogProductsResponseSchema,
  catalogProductsQuerySchema,
  catalogErrorEnvelopeSchema,
} from '../schemas/catalog.schemas'

export type CatalogBusiness = z.infer<typeof catalogBusinessSchema>
export type CatalogCategory = z.infer<typeof catalogCategorySchema>
export type CatalogProductCategory = z.infer<typeof catalogProductCategorySchema>
export type CatalogProductImage = z.infer<typeof catalogProductImageSchema>
export type CatalogProductListItem = z.infer<typeof catalogProductListItemSchema>
export type CatalogProductDetail = z.infer<typeof catalogProductDetailSchema>
export type ProductRichContent = z.infer<typeof productRichContentSchema>
export type ProductRichContentBlock = z.infer<typeof productRichContentBlockSchema>
export type CatalogPagination = z.infer<typeof catalogPaginationSchema>
export type CatalogProductsResponse = z.infer<typeof catalogProductsResponseSchema>
export type CatalogProductsQuery = z.input<typeof catalogProductsQuerySchema>
export type CatalogFieldError = NonNullable<z.infer<typeof catalogErrorEnvelopeSchema>['errors']>[number]
