import type { WhatsAppCheckoutItem } from '../types/whatsapp.types'
import { getWhatsAppCheckoutHref } from '../utils/whatsapp-checkout'

export function WhatsAppCheckoutLink({ items }: { items: readonly WhatsAppCheckoutItem[] }) {
  if (items.length === 0) return null
  const href = getWhatsAppCheckoutHref(items)
  return (
    <div className="space-y-3 rounded-xl border bg-muted/30 p-5">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block min-h-11 rounded-lg bg-primary px-5 py-3 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
          Consultar por WhatsApp<span className="sr-only"> (abre en una nueva pestaña)</span>
        </a>
      ) : (
        <button type="button" disabled className="bg-primary px-5 py-3 text-primary-foreground opacity-50">Consultar por WhatsApp</button>
      )}
      <p className="text-sm text-muted-foreground">
        {href ? 'El precio y la disponibilidad se confirman por WhatsApp.' : 'El contacto por WhatsApp no está disponible en este momento.'}
      </p>
    </div>
  )
}
