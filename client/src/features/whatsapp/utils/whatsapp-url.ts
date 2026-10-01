export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  if (!/^\d{8,15}$/.test(phoneNumber) || !message.trim()) {
    throw new Error('No se puede construir el enlace de contacto.')
  }
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
