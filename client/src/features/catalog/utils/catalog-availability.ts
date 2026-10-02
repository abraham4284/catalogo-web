type CatalogAvailability = { available: boolean; stockAvailable: number }

export function isCatalogProductAvailable(product: CatalogAvailability): boolean {
  return product.available && product.stockAvailable > 0
}
