const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

export function formatCatalogPrice(price: number): string {
  return priceFormatter.format(price)
}
