import { Link } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'

export function StoreFooter({ note }: { note: string }) {
  return (
    <footer className="bg-foreground text-background [--ring:var(--background)]">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm sm:px-6 lg:px-8">
        <div className="min-w-0 space-y-3">
          <BrandLogo className="w-80 max-w-full lg:w-96" />
          <p className="max-w-sm leading-relaxed text-background/80">{note}</p>
        </div>
        <nav aria-label="Navegación del pie" className="min-w-0">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-6">
            <li>
              <Link to="/" className="inline-flex min-h-11 items-center py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className="inline-flex min-h-11 items-center py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Productos
              </Link>
            </li>
            <li><Link to="/carrito" className="inline-flex min-h-11 items-center hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Carrito</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
