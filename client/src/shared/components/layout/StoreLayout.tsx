import { Outlet } from 'react-router-dom'
import { StoreFooter } from './StoreFooter'
import { StoreHeader } from './StoreHeader'
import { AnnouncementBar } from './AnnouncementBar'

export function StoreLayout({ cartCount, announcement, footerNote }: { cartCount: number; announcement: string; footerNote: string }) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-background focus:p-4 focus:outline-2 focus:outline-foreground"
      >
        Saltar al contenido
      </a>
      <AnnouncementBar text={announcement} />
      <StoreHeader cartCount={cartCount} />
      <main id="main-content" tabIndex={-1} className="mx-auto min-w-0 w-full max-w-7xl flex-1 px-4 py-12 [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-foreground sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <StoreFooter note={footerNote} />
    </div>
  )
}
