import { getWhatsAppNumber } from '@/config/env'
import { buildWhatsAppProductInquiryMessage } from '../domain/whatsapp-product-inquiry'
import type { WhatsAppProductInquiry } from '../types/whatsapp.types'
import { buildWhatsAppUrl } from './whatsapp-url'

export function getWhatsAppProductInquiryHref(product: WhatsAppProductInquiry): string | undefined {
  try {
    return buildWhatsAppUrl(getWhatsAppNumber(), buildWhatsAppProductInquiryMessage(product))
  } catch {
    return undefined
  }
}
