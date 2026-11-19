import { useEffect, useState, type RefObject } from 'react'
import { getSecondProductRowIndex, isCatalogQuickVisible } from '../utils/catalog-quick-visibility'

export function useCatalogQuickVisibility(productsRef: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const products = productsRef.current
    if (!products) return
    let frame = 0
    let needsRowMeasurement = true
    let secondRow: HTMLElement | null = null
    const measure = () => {
      frame = 0
      if (needsRowMeasurement) {
        // Only inspect the actual product grid on layout changes, excluding editorial blocks.
        const grid = products.querySelector('article')?.closest('ul')
        const items = [...(grid?.querySelectorAll('article') ?? [])].map((article) => article.parentElement)
          .filter((item): item is HTMLElement => item !== null)
        const index = getSecondProductRowIndex(items.map((item) => item.getBoundingClientRect().top))
        secondRow = items[index] ?? null
        needsRowMeasurement = false
      }
      setVisible(isCatalogQuickVisible(secondRow?.getBoundingClientRect().top ?? null,
        window.visualViewport?.height ?? window.innerHeight))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const resize = () => { needsRowMeasurement = true; schedule() }
    const observer = new ResizeObserver(resize)
    observer.observe(products)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
    }
  }, [productsRef])
  return visible
}
