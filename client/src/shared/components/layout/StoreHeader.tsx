import { Link, NavLink } from 'react-router-dom'
import { ShoppingBagIcon } from '@phosphor-icons/react/dist/csr/ShoppingBag'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'
import { formatCurrency } from '@/shared/utils/format-currency'
import { storeNavigation } from './store-navigation'

const focusClasses = 'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'

type StoreHeaderProps = {
  cartCount: number
  cartTotal: number
  cartOpen: boolean
  menuOpen: boolean
  onOpenCart: (trigger: HTMLElement) => void
  onOpenMenu: (trigger: HTMLElement) => void
  onPrefetchRoute: (href: string) => void
}

export function StoreHeader({ cartCount, cartTotal, cartOpen, menuOpen, onOpenCart, onOpenMenu, onPrefetchRoute }: StoreHeaderProps) {
  return (
    <header className="bg-foreground text-background [--ring:var(--background)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:gap-4 sm:px-6 sm:py-1 lg:px-8">
        <Link to="/" className={`block max-w-full shrink-0 ${focusClasses}`}>
          <BrandLogo variant="mark" className="w-16 xl:hidden" />
          <BrandLogo className="hidden w-56 xl:block" />
        </Link>
        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-5 sm:justify-end">
          <button type="button" aria-expanded={menuOpen} aria-controls="store-panel" aria-haspopup="dialog" onClick={(event) => onOpenMenu(event.currentTarget)} className={`min-h-11 px-3 text-sm xl:hidden ${focusClasses}`}>Menú</button>
          <nav aria-label="Navegación principal" className="hidden xl:block">
            <ul className="flex flex-wrap items-center gap-4 text-sm">
              {storeNavigation.map((link) => <li key={link.href}><NavLink to={link.href} end={link.href === '/'} onPointerEnter={() => onPrefetchRoute(link.href)} onFocus={() => onPrefetchRoute(link.href)} className={`inline-flex min-h-11 items-center text-background/80 aria-[current=page]:font-semibold aria-[current=page]:text-background aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>{link.label}</NavLink></li>)}
            </ul>
          </nav>
          <button id="cart-access" type="button" aria-label={`Abrir carrito, ${cartCount} ${cartCount === 1 ? 'unidad' : 'unidades'}`} aria-expanded={cartOpen} aria-controls="store-panel" aria-haspopup="dialog" onClick={(event) => onOpenCart(event.currentTarget)} className={`inline-flex min-h-11 min-w-0 max-w-52 items-center gap-3 rounded-full border border-background/35 bg-background/5 px-4 py-2 text-left hover:bg-background/10 aria-expanded:border-background/70 [overflow-wrap:anywhere] ${focusClasses}`}>
            <span aria-hidden="true" className="relative shrink-0">
              <ShoppingBagIcon size={24} weight="light" />
              <span className="absolute -right-1.5 -top-1.5 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground ring-2 ring-foreground">{cartCount}</span>
            </span>
            <span className="min-w-0 space-y-0.5">
              <span className="block text-xs font-medium lg:hidden">Carrito</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-background/75 lg:block">Mi pedido</span>
              <span className="hidden text-xs font-bold tabular-nums lg:block">{formatCurrency(cartTotal)}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
