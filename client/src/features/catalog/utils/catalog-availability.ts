import type { ProductAvailabilityStatus } from '../types/catalog.types'

export function getCatalogAvailabilityLabel(status: ProductAvailabilityStatus): string {
  const labels: Record<ProductAvailabilityStatus, string> = {
    in_stock: 'Disponible',
    out_of_stock: 'No disponible',
    on_order: 'Por encargo',
  }
  return labels[status]
}
