import { getWhatsAppNumber } from '@/config/env'
import { buildWhatsAppCheckoutMessage } from '../domain/whatsapp-message'
import type { WhatsAppCheckoutItem } from '../types/whatsapp.types'
import { buildWhatsAppUrl } from './whatsapp-url'

export function getWhatsAppCheckoutHref(items: readonly WhatsAppCheckoutItem[]): string | undefined {
  if (items.length === 0) return undefined
  try {
    const number = getWhatsAppNumber()
    return buildWhatsAppUrl(number, buildWhatsAppCheckoutMessage(items))
  } catch {
    return undefined
  }
}
