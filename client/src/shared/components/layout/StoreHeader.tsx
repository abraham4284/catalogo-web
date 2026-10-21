import { Link, NavLink } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/brand/BrandLogo'

const focusClasses = 'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'

export function StoreHeader({ cartCount }: { cartCount: number }) {
  return (
    <header className="bg-foreground text-background [--ring:var(--background)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row sm:gap-4 sm:px-6 sm:py-1 lg:px-8">
        <Link to="/" className={`block max-w-full shrink-0 ${focusClasses}`}>
          <BrandLogo variant="mark" className="w-16 sm:hidden" />
          <BrandLogo className="hidden w-52 sm:block lg:w-56" />
        </Link>
        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap items-center justify-center gap-3 text-sm sm:justify-end sm:gap-6 [&_a]:min-h-11 [&_a]:py-3">
            <li>
              <NavLink to="/" end className={`inline-block py-2 text-background/80 hover:text-background aria-[current=page]:text-background aria-[current=page]:font-semibold aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" className={`inline-block py-2 text-background/80 hover:text-background aria-[current=page]:text-background aria-[current=page]:font-semibold aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/carrito" aria-label={`Carrito, ${cartCount} ${cartCount === 1 ? 'unidad' : 'unidades'}`} className={`inline-flex items-center gap-2 py-2 text-background/80 hover:text-background aria-[current=page]:text-background aria-[current=page]:font-semibold aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Carrito <span aria-hidden="true" className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs tabular-nums text-primary-foreground">{cartCount}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
