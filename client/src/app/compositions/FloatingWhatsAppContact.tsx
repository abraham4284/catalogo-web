import { useToasterStore } from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAnalyticsConsent } from '@/features/analytics'
import { FloatingWhatsAppButton } from '@/features/whatsapp'
import { useStorefrontUi } from '../storefront-ui.store'

export function FloatingWhatsAppContact() {
  const panel = useStorefrontUi((state) => state.panel)
  const bannerVisible = useAnalyticsConsent((state) => state.consent === 'unknown' || state.preferences)
  const { toasts } = useToasterStore()
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [obscured, setObscured] = useState(true)
  const { pathname } = useLocation()
  const blocked = Boolean(panel || bannerVisible || toasts.length > 0)

  useEffect(() => {
    if (blocked) return
    let frame = 0
    const measure = () => {
      // A fixed contact must yield to page actions as they scroll underneath it.
      const controls = document.querySelectorAll<HTMLElement>('main a, main button, main input, main textarea, main select, main summary, footer a, footer button')
      const bounds = [...controls].filter((control) => !control.matches('article > a'))
        .map((control) => control.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0)
      const intersects = (a: DOMRect, b: DOMRect) => a.left < b.right + 8 && a.right > b.left - 8
        && a.top < b.bottom + 8 && a.bottom > b.top - 8
      const quickBar = document.querySelector<HTMLElement>('[data-catalog-quick-bar]')
      const quickBounds = quickBar?.getBoundingClientRect()
      if (quickBar && quickBounds) {
        quickBar.dataset.obscured = String(!quickBar.contains(document.activeElement) && bounds.some((rect) => intersects(rect, quickBounds)))
      }
      const anchor = anchorRef.current
      if (!anchor) return
      const contact = anchor.getBoundingClientRect()
      const quickOverlap = quickBar && quickBounds && getComputedStyle(quickBar).visibility === 'visible' && intersects(contact, quickBounds)
      setObscured(Boolean(quickOverlap || document.querySelector('[data-catalog-quick-open]')) || bounds.some((rect) => intersects(rect, contact)))
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    const contentObserver = new MutationObserver(schedule)
    const main = document.getElementById('main-content')
    if (main) {
      observer.observe(main)
      contentObserver.observe(main, { childList: true, subtree: true })
      main.addEventListener('animationend', schedule)
    }
    window.addEventListener('scroll', schedule, { passive: true, capture: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('focusin', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      contentObserver.disconnect()
      main?.removeEventListener('animationend', schedule)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('focusin', schedule)
    }
  }, [blocked, pathname])

  // Include exiting toasts so the contact button never overlaps their fade-out.
  if (blocked) return null
  return <FloatingWhatsAppButton anchorRef={anchorRef} obscured={obscured} />
}
