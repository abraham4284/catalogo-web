import { useEffect, useState } from 'react'
import { getCatalogProducts } from '../api/catalog.api'
import { getRememberedProducts, rememberCatalogProducts, getRememberedRelated, rememberRelated } from '../api/merchandising-cache'
import { selectRelatedProducts } from '../utils/merchandising'
import type { CatalogProductListItem } from '../types/catalog.types'

type Current = { idProduct: number; slug: string; category: { slug: string } }
export function useRelatedProducts(current: Current) {
  const { idProduct, slug, category: { slug: categorySlug } } = current
  const key = `${idProduct}:${slug}:${categorySlug}`
  const [result, setResult] = useState<{ key: string; loading: boolean; items: CatalogProductListItem[] }>({ key: '', loading: true, items: [] })
  useEffect(() => {
    const controller = new AbortController()
    const selection = { idProduct, slug, category: { slug: categorySlug } }
    const categoryCache = getRememberedRelated(categorySlug)
    const cached = selectRelatedProducts(categoryCache ?? getRememberedProducts(), selection)
    if (categoryCache || cached.length >= 4) {
      void Promise.resolve().then(() => { if (!controller.signal.aborted) setResult({ key, loading: false, items: cached }) })
      return () => controller.abort()
    }
    getCatalogProducts({ categorySlug, page: 1, limit: 9 }, controller.signal).then((data) => {
      if (controller.signal.aborted) return
      rememberCatalogProducts(data.items)
      rememberRelated(categorySlug, data.items)
      setResult({ key, loading: false, items: selectRelatedProducts(data.items, selection) })
    }).catch(() => { if (!controller.signal.aborted) setResult({ key, loading: false, items: cached }) })
    return () => controller.abort()
  }, [idProduct, slug, categorySlug, key])
  return result.key === key ? result : { loading: true, items: [] }
}
