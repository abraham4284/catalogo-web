import { create } from 'zustand'

export const CONSENT_KEY = 'vitruno-analytics-consent-v1'
export type Consent = 'unknown' | 'accepted' | 'rejected'
export function parseConsent(value: string | null): Consent {
  return value === 'accepted' || value === 'rejected' ? value : 'unknown'
}
function readConsent(): Consent {
  try { return parseConsent(localStorage.getItem(CONSENT_KEY)) } catch { return 'unknown' }
}
export const useAnalyticsConsent = create<{
  consent: Consent; preferences: boolean
  openPreferences: () => void
  choose: (consent: Exclude<Consent, 'unknown'>) => void
}>((set) => ({
  consent: readConsent(), preferences: false,
  openPreferences: () => set({ preferences: true }),
  choose: (consent) => {
    try { localStorage.setItem(CONSENT_KEY, consent) } catch { /* Memory-only choice if storage is blocked. */ }
    set({ consent, preferences: false })
  },
}))
