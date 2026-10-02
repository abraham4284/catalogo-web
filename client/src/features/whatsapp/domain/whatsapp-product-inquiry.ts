import { formatCurrency } from '@/shared/utils/format-currency'
import type { WhatsAppProductInquiry } from '../types/whatsapp.types'

export function buildWhatsAppProductInquiryMessage(product: WhatsAppProductInquiry): string {
  const name = product.name.replace(/\s+/g, ' ').trim()
  if (!name || !Number.isFinite(product.price)) throw new Error('Los datos de la consulta no son válidos.')
  const price = `Precio publicado: ${formatCurrency(product.price)}`
  return product.available
    ? ['Hola, quiero consultar por este producto:', '', name, price, '', 'Quisiera confirmar precio y disponibilidad. Gracias.'].join('\n')
    : [`Hola, quería consultar por la disponibilidad de ${name}.`, '', price, '', 'Gracias.'].join('\n')
}
