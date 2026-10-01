import { Outlet } from 'react-router-dom'
import { StoreFooter } from './StoreFooter'
import { StoreHeader } from './StoreHeader'

export function StoreLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-background focus:p-4 focus:outline-2 focus:outline-ring"
      >
        Saltar al contenido
      </a>
      <StoreHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  )
}
