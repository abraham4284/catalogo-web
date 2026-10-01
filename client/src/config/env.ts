import { z } from 'zod'

const catalogApiUrlSchema = z.string()
  .trim()
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol))

export function getCatalogApiUrl(): string {
  const result = catalogApiUrlSchema.safeParse(import.meta.env.VITE_CATALOG_API_URL)

  if (!result.success) {
    throw new Error('Configurá VITE_CATALOG_API_URL con una URL HTTP o HTTPS válida.')
  }

  return result.data
}
