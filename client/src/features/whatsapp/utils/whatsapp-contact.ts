import { getWhatsAppNumber } from '@/config/env'
import { buildWhatsAppContactMessage } from '../domain/whatsapp-contact-message'
import { buildWhatsAppUrl } from './whatsapp-url'

export function getWhatsAppContactHref(input: unknown): string | undefined {
  try {
    return buildWhatsAppUrl(getWhatsAppNumber(), buildWhatsAppContactMessage(input))
  } catch {
    return undefined
  }
}
