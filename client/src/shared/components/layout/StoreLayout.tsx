import { Outlet, useLocation } from 'react-router-dom'
import { StoreFooter } from './StoreFooter'
import { StoreHeader } from './StoreHeader'
import { AnnouncementBar } from './AnnouncementBar'

type StoreLayoutProps = {
  cartCount: number
  cartTotal: number
  cartOpen: boolean
  menuOpen: boolean
  onOpenCart: (trigger: HTMLElement) => void
  onOpenMenu: (trigger: HTMLElement) => void
  onPrefetchRoute: (href: string) => void
  announcement: string
  footerNote: string
}

export function StoreLayout({ announcement, footerNote, ...headerProps }: StoreLayoutProps) {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-background focus:p-4 focus:outline-2 focus:outline-foreground">Saltar al contenido</a>
      <AnnouncementBar text={announcement} />
      <StoreHeader {...headerProps} />
      <main id="main-content" tabIndex={-1} className="mx-auto min-w-0 w-full max-w-7xl flex-1 px-4 py-12 [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-foreground sm:px-6 lg:px-8">
        <div key={pathname} className="route-enter">
          <Outlet />
        </div>
      </main>
      <StoreFooter note={footerNote} onPrefetchRoute={headerProps.onPrefetchRoute} />
    </div>
  )
}
