import { Link } from 'react-router-dom'

export function StoreFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Storefront</p>
        <nav aria-label="Navegación del pie">
          <ul className="flex gap-4 sm:gap-6">
            <li>
              <Link to="/" className="inline-block py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos" className="inline-block py-2 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
                Productos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
