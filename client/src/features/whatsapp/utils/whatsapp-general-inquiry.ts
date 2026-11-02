import { getWhatsAppNumber } from '@/config/env'
import { buildWhatsAppUrl } from './whatsapp-url'

export const GENERAL_WHATSAPP_MESSAGE = '¡Hola! 👋 Quisiera realizar una consulta sobre los productos de VITRUNO. ¿Me pueden ayudar?'

export function getWhatsAppGeneralInquiryHref(): string | undefined {
  try {
    return buildWhatsAppUrl(getWhatsAppNumber(), GENERAL_WHATSAPP_MESSAGE)
  } catch {
    return undefined
  }
}
