// Round decimal prices per line, half up, before summing. Decimal strings avoid
// binary ties such as 1.005 * 3 and require no monetary dependency.
export function moneyLineCents(unitPrice: number, quantity = 1): number {
  if (!Number.isFinite(unitPrice) || !Number.isSafeInteger(quantity) || quantity < 0) return NaN
  const [mantissa, exponent = '0'] = Math.abs(unitPrice).toString().split('e')
  const [whole, fraction = ''] = mantissa.split('.')
  const coefficient = BigInt(whole + fraction) * BigInt(quantity)
  const shift = 2 + Number(exponent) - fraction.length
  const divisor = shift < 0 ? 10n ** BigInt(-shift) : 1n
  const cents = shift >= 0 ? coefficient * 10n ** BigInt(shift) : (coefficient + divisor / 2n) / divisor
  const result = Number(unitPrice < 0 ? -cents : cents)
  return Number.isSafeInteger(result) ? result : NaN
}

export function sumCents(values: readonly number[]): number {
  const sum = values.reduce((total, value) => total + value, 0)
  return Number.isSafeInteger(sum) ? sum : NaN
}
