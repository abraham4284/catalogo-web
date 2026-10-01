const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

export function formatCurrency(value: number): string {
  return formatter.format(value)
}
