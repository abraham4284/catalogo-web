import type { ProductAvailabilityStatus } from '../types/catalog.types'
import { getCatalogAvailabilityLabel } from '../utils/catalog-availability'

export function ProductAvailabilityBadge({ status }: { status: ProductAvailabilityStatus }) {
  return <span className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium"><span aria-hidden="true" className={`size-1.5 rounded-full ${status === 'in_stock' ? 'bg-foreground' : 'border border-muted-foreground'}`} />{getCatalogAvailabilityLabel(status)}</span>
}
