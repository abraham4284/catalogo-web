import { formatCurrency } from '@/shared/utils/format-currency'
import type { WhatsAppCheckoutItem } from '../types/whatsapp.types'

export function buildWhatsAppCheckoutMessage(items: readonly WhatsAppCheckoutItem[]): string {
  if (items.length === 0) throw new Error('La consulta requiere productos.')

  let total = 0
  const lines = items.map((item) => {
    const name = item.name.replace(/\s+/g, ' ').trim()
    const subtotal = item.price * item.quantity
    if (!name || !Number.isFinite(item.price) || !Number.isSafeInteger(item.quantity)
      || item.quantity <= 0 || !Number.isFinite(subtotal)) {
      throw new Error('Los datos de la consulta no son válidos.')
    }
    total += subtotal
    return `- ${item.quantity} x ${name} — ${formatCurrency(item.price)} c/u — subtotal ${formatCurrency(subtotal)}`
  })
  if (!Number.isFinite(total)) throw new Error('El total de la consulta no es válido.')

  return [
    'Hola, quiero consultar por estos productos:',
    '',
    ...lines,
    '',
    `Total estimado: ${formatCurrency(total)}`,
    '',
    'Quisiera confirmar precio y disponibilidad. Gracias.',
  ].join('\n')
}
