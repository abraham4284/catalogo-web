import { getWhatsAppNumber } from '@/config/env'
import { buildWhatsAppUrl } from './whatsapp-url'

export const GENERAL_WHATSAPP_MESSAGE = '¡Hola! 👋 Quisiera realizar una consulta sobre los productos de VITRUNO. ¿Me pueden ayudar?'
export const WHOLESALE_WHATSAPP_MESSAGE = '¡Hola! Quisiera consultar las condiciones y los mínimos vigentes para acceder como cliente mayorista de VITRUNO. ¿Me pueden ayudar?'

function getInquiryHref(message: string): string | undefined {
  try {
    return buildWhatsAppUrl(getWhatsAppNumber(), message)
  } catch {
    return undefined
  }
}

export function getWhatsAppGeneralInquiryHref() {
  return getInquiryHref(GENERAL_WHATSAPP_MESSAGE)
}

export function getWhatsAppWholesaleInquiryHref() {
  return getInquiryHref(WHOLESALE_WHATSAPP_MESSAGE)
}
