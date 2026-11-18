import { useLayoutEffect } from 'react'

export function isProductDetailPath(pathname: string) {
  return /^\/productos\/[^/]+\/?$/.test(pathname)
}

export function useProductEntryScroll(pathname: string, navigationKey: string) {
  useLayoutEffect(() => {
    if (!isProductDetailPath(pathname)) return
    // Reload restoration can run after data/images arrive, so suspend it for this view.
    window.history.scrollRestoration = 'manual'
    // Coordinate with route focus and the browser's history restoration once per entry.
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
    return () => {
      cancelAnimationFrame(frame)
      window.history.scrollRestoration = 'auto'
    }
  }, [pathname, navigationKey])
}
