import type { ProductAvailabilityStatus } from '../types/catalog.types'
import { getCatalogAvailabilityLabel } from '../utils/catalog-availability'

export function ProductAvailabilityBadge({ status }: { status: ProductAvailabilityStatus }) {
  const surface = status === 'in_stock' ? 'border-primary/30 bg-primary/10'
    : status === 'on_order' ? 'border-accent bg-accent' : 'border-border bg-muted'
  return <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-foreground ${surface}`}><span aria-hidden="true" className={`size-1.5 rounded-full ${status === 'in_stock' ? 'bg-primary' : 'border border-muted-foreground'}`} />{getCatalogAvailabilityLabel(status)}</span>
}
