import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CONSENT_KEY, parseConsent, useAnalyticsConsent } from './consent'
import { revokeMetaPixel, trackPageView } from './meta-pixel'

export function AnalyticsConsent() {
  const { pathname } = useLocation()
  const { consent, preferences, choose } = useAnalyticsConsent()
  useEffect(() => { trackPageView(pathname) }, [pathname, consent])
  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if ((event.key === CONSENT_KEY || event.key === null)) {
        const next = parseConsent(event.newValue)
        const previous = useAnalyticsConsent.getState().consent
        useAnalyticsConsent.setState({ consent: next })
        if (previous === 'accepted' && next !== 'accepted') revokeMetaPixel()
      }
    }
    window.addEventListener('storage', synchronize)
    return () => window.removeEventListener('storage', synchronize)
  }, [])
  if (consent !== 'unknown' && !preferences) return null
  function decide(next: 'accepted' | 'rejected') {
    choose(next)
    if (consent === 'accepted' && next === 'rejected') revokeMetaPixel()
  }
  const button = 'min-h-11 rounded-md border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'
  return (
    <section aria-label="Preferencias de cookies" className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-xl border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-foreground shadow-lg">
      <h2 className="font-semibold">Preferencias de cookies</h2>
      <p className="my-3 text-sm leading-relaxed">Usamos cookies de medición publicitaria de Meta para entender el rendimiento de nuestras campañas. Solo se activarán si aceptás. Podés cambiar tu decisión desde el pie de página.</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={button} onClick={() => decide('accepted')}>Aceptar medición</button>
        <button type="button" className={button} onClick={() => decide('rejected')}>Rechazar medición</button>
      </div>
    </section>
  )
}
