import type { ProductAvailabilityStatus } from '../types/catalog.types'
import { getCatalogAvailabilityLabel } from '../utils/catalog-availability'

export function ProductAvailabilityBadge({ status }: { status: ProductAvailabilityStatus }) {
  const surface = status === 'in_stock' ? 'border-brand-teal/40 bg-brand-teal/10'
    : status === 'on_order' ? 'border-brand-gold bg-brand-gold/15' : 'border-border bg-muted'
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-foreground ${surface}`}><span aria-hidden="true" className={`size-1.5 rounded-full ${status === 'in_stock' ? 'bg-brand-teal' : 'border border-muted-foreground'}`} />{getCatalogAvailabilityLabel(status)}</span>
}
