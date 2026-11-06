import { formatCurrency } from '@/shared/utils/format-currency'
import { moneyLineCents, sumCents } from '@/shared/utils/money'
import type { PricingType } from '@/shared/types/pricing'
import type { WhatsAppCheckoutItem } from '../types/whatsapp.types'

export function buildWhatsAppCheckoutMessage(items: readonly WhatsAppCheckoutItem[], pricingType: PricingType = 'RETAIL'): string {
  if (items.length === 0 || !['RETAIL', 'WHOLESALE'].includes(pricingType)) throw new Error('La consulta requiere productos válidos.')
  const lines = items.map(item => {
    const name = item.name.replace(/\s+/g, ' ').trim()
    const cents = moneyLineCents(item.unitPrice, item.quantity)
    if (!name || !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || item.unitPrice < 0
      || !Number.isFinite(cents) || !Number.isFinite(item.lineTotal) || item.lineTotal !== cents / 100) {
      throw new Error('Los datos de la consulta no son válidos.')
    }
    return `- ${item.quantity} x ${name} — ${formatCurrency(item.unitPrice)} c/u — subtotal ${formatCurrency(item.lineTotal)}`
  })
  const totalCents = sumCents(items.map(item => moneyLineCents(item.lineTotal)))
  if (!Number.isFinite(totalCents)) throw new Error('El total de la consulta no es válido.')
  const wholesale = pricingType === 'WHOLESALE'
  return [
    'Hola, quiero consultar por estos productos:', '',
    `Tipo: Compra ${wholesale ? 'mayorista' : 'minorista'}`, '', ...lines, '',
    `${wholesale ? 'Total mayorista' : 'Total estimado'}: ${formatCurrency(totalCents / 100)}`, '',
    ...(wholesale ? ['Esta compra cumple el mínimo para alta mayorista.', ''] : []),
    'Quisiera confirmar precio y disponibilidad. Gracias.',
  ].join('\n')
}
