import { Link, NavLink } from 'react-router-dom'

const focusClasses = 'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'

export function StoreHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className={`font-semibold ${focusClasses}`}>
          Storefront
        </Link>
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-4 text-sm sm:gap-6">
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
          </ul>
        </nav>
      </div>
    </header>
  )
}
