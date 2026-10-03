import { formatCurrency } from '@/shared/utils/format-currency'
import type { WhatsAppProductInquiry, WhatsAppInquiryAvailability } from '../types/whatsapp.types'

export function buildWhatsAppProductInquiryMessage(product: WhatsAppProductInquiry): string {
  const name = product.name.replace(/\s+/g, ' ').trim()
  if (!name || !Number.isFinite(product.price)) throw new Error('Los datos de la consulta no son válidos.')
  const price = `Precio publicado: ${formatCurrency(product.price)}`
  if (product.availabilityStatus === 'on_order') {
    return ['Hola, quiero consultar por encargo:', '', name, price, '', 'Quisiera conocer disponibilidad y condiciones del encargo. Gracias.'].join('\n')
  }
  return product.availabilityStatus === 'in_stock'
    ? ['Hola, quiero consultar por este producto:', '', name, price, '', 'Quisiera confirmar precio y disponibilidad. Gracias.'].join('\n')
    : [`Hola, quería consultar por la disponibilidad de ${name}.`, '', price, '', 'Gracias.'].join('\n')
}

export function getWhatsAppProductInquiryLabel(status: WhatsAppInquiryAvailability): string {
  const labels: Record<WhatsAppInquiryAvailability, string> = {
    in_stock: 'Consultar ahora', out_of_stock: 'Consultar disponibilidad', on_order: 'Consultar por encargo',
  }
  return labels[status]
}
