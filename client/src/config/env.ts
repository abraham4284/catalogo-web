import { z } from 'zod'

const whatsAppNumberSchema = z.string().regex(/^\d{8,15}$/)

export function getWhatsAppNumber(): string {
  return whatsAppNumberSchema.parse(import.meta.env.VITE_WHATSAPP_NUMBER)
}

const catalogApiUrlSchema = z.string()
  .trim()
  .url()
  .refine((value) => {
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
      return false
    }
  })

export function getCatalogApiUrl(): string {
  const result = catalogApiUrlSchema.safeParse(import.meta.env.VITE_CATALOG_API_URL)

  if (!result.success) {
    throw new Error('Configurá VITE_CATALOG_API_URL con una URL HTTP o HTTPS válida.')
  }

  return result.data
}
