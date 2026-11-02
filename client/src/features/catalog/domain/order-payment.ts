export function calculateOrderPayment(price: number) {
  const cents = Math.round(price * 100)
  if (!Number.isFinite(price) || price <= 0 || !Number.isSafeInteger(cents) || cents <= 0) return undefined
  const depositCents = Math.round(cents * 0.30)
  return { deposit: depositCents / 100, balance: (cents - depositCents) / 100 }
}
