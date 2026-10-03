import { useEffect, useState } from 'react'
import { getCatalogProductBySlug } from '@/features/catalog'
import { useCartStore, type CartItem } from '@/features/cart'
import { getCartVerificationKey, revalidateCartProducts, type CartVerificationTarget } from './cart-catalog-revalidation'

type VerificationState =
  | { status: 'idle' | 'loading' | 'success'; failedProductIds: number[] }
  | { status: 'error'; failedProductIds: number[] }

export function useCartCatalogRevalidation(items: readonly CartItem[]) {
  const key = getCartVerificationKey(items)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{ key: string; attempt: number; state: VerificationState }>()

  useEffect(() => {
    const targets: CartVerificationTarget[] = JSON.parse(key)
    if (targets.length === 0) return
    const controller = new AbortController()
    revalidateCartProducts(targets, getCatalogProductBySlug, controller.signal).then((verification) => {
      if (!verification || controller.signal.aborted
        || getCartVerificationKey(useCartStore.getState().items) !== key) return
      verification.snapshots.forEach((snapshot) => useCartStore.getState().reconcileItem(snapshot))
      setResult({ key, attempt, state: {
        status: verification.failedProductIds.length > 0 ? 'error' : 'success',
        failedProductIds: verification.failedProductIds,
      } })
    })
    return () => controller.abort()
  }, [key, attempt])

  const state: VerificationState = items.length === 0
    ? { status: 'idle', failedProductIds: [] }
    : result?.key === key && result.attempt === attempt
      ? result.state : { status: 'loading', failedProductIds: [] }
  return { ...state, retry: () => setAttempt((value) => value + 1) }
}
