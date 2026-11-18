import { useToasterStore } from 'react-hot-toast'
import { useAnalyticsConsent } from '@/features/analytics'
import { CatalogQuickActions, type CatalogQuickActionsProps } from '@/features/catalog/components/CatalogQuickActions'
import { useStorefrontUi } from '../storefront-ui.store'

export function QuickCatalogActions(props: CatalogQuickActionsProps) {
  const panel = useStorefrontUi((state) => state.panel)
  const consentVisible = useAnalyticsConsent((state) => state.consent === 'unknown' || state.preferences)
  const { toasts } = useToasterStore()
  if (panel || consentVisible || toasts.length > 0) return null
  return <CatalogQuickActions {...props} />
}
