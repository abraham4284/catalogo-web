import type { CartItem } from '../types/cart.types'

export function calculateCartLineTotal(item: CartItem): number {
  return item.price * item.quantity
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + calculateCartLineTotal(item), 0)
}

export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}
