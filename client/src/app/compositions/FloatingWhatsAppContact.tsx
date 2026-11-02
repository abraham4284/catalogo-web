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
      const anchor = anchorRef.current
      if (!anchor) return
      const contact = anchor.getBoundingClientRect()
      // A fixed contact must yield to page actions as they scroll underneath it.
      const controls = document.querySelectorAll<HTMLElement>('main a, main button, main input, main textarea, main select, main summary, footer a, footer button')
      const overlapping = [...controls].some((control) => {
        if (control.matches('article > a')) return false
        const rect = control.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0 && rect.left < contact.right + 8 && rect.right > contact.left - 8
          && rect.top < contact.bottom + 8 && rect.bottom > contact.top - 8
      })
      setObscured(overlapping)
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
