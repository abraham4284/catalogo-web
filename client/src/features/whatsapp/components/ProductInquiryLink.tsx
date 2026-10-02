import type { WhatsAppProductInquiry } from '../types/whatsapp.types'
import { getWhatsAppProductInquiryHref } from '../utils/whatsapp-product-inquiry'

export function ProductInquiryLink({ product }: { product: WhatsAppProductInquiry }) {
  const href = getWhatsAppProductInquiryHref(product)
  const label = product.available ? 'Consultar ahora' : 'Consultar disponibilidad'
  const className = 'flex min-h-11 w-full items-center justify-center border px-4 py-3 text-center text-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'
  return (
    <div className="space-y-2">
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}<span className="sr-only"> (abre en una nueva pestaña)</span></a>
        : <button type="button" disabled className={`${className} opacity-50`}>{label}</button>}
      {!href && <p className="text-sm text-muted-foreground">El contacto por WhatsApp no está disponible en este momento.</p>}
    </div>
  )
}
