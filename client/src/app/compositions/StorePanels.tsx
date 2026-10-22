import { NavLink } from 'react-router-dom'
import { SidePanel } from '@/shared/components/ui/SidePanel'
import { storeNavigation } from '@/shared/components/layout/store-navigation'
import { CartPreview } from '@/features/cart'
import { useStorefrontUi } from '../storefront-ui.store'
import { prefetchRoute } from '../navigation-prefetch'

export function StorePanels() {
  const { panel, contentPanel, closePanel, closeForNavigation } = useStorefrontUi()
  return (
    <SidePanel open={panel !== null} title={contentPanel === 'menu' ? 'Menú' : 'Tu carrito'} onClose={closePanel} getReturnFocus={() => useStorefrontUi.getState().returnFocus}>
      {contentPanel === 'menu' ? (
        <nav aria-label="Navegación del menú">
          <ul className="space-y-2">
            {storeNavigation.map((link) => <li key={link.href}><NavLink to={link.href} end={link.href === '/'} onPointerEnter={() => prefetchRoute(link.href)} onFocus={() => prefetchRoute(link.href)} onClick={closeForNavigation} className="block min-h-11 rounded-md px-3 py-3 aria-[current=page]:bg-accent aria-[current=page]:font-semibold focus-visible:outline-2 focus-visible:outline-ring">{link.label}</NavLink></li>)}
          </ul>
        </nav>
      ) : <CartPreview onNavigate={closeForNavigation} />}
    </SidePanel>
  )
}
