import { Link, NavLink } from 'react-router-dom'

const focusClasses = 'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'

export function StoreHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8">
        <Link to="/" className={`font-semibold ${focusClasses}`}>
          Storefront
        </Link>
        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap items-center gap-4 text-sm sm:gap-6 [&_a]:min-h-11 [&_a]:py-3">
            <li>
              <NavLink to="/" end className={`inline-block py-2 text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" className={`inline-block py-2 text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Productos
              </NavLink>
            </li>
            <li>
              <NavLink to="/carrito" className={`inline-block py-2 text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline underline-offset-8 ${focusClasses}`}>
                Carrito
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
