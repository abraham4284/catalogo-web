import type { CatalogProductListItem } from '../types/catalog.types'

type LastUnitBadgeProps = Pick<CatalogProductListItem, 'availabilityStatus' | 'stockAvailable'> & { className?: string }

export function LastUnitBadge({ availabilityStatus, stockAvailable, className = '' }: LastUnitBadgeProps) {
  if (availabilityStatus !== 'in_stock' || stockAvailable !== 1) return null
  return <span className={`rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground ${className}`}>ÚLTIMA UNIDAD</span>
}
