import { Link } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'
import { BuyingSteps } from '@/shared/components/guidance/BuyingSteps'

export function HowToBuyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Cómo comprar</h1>
      <p className="max-w-prose leading-relaxed text-muted-foreground">Explorá los productos, armá tu selección y coordinemos los detalles por WhatsApp. Agregar al carrito no reserva stock.</p>
      <BuyingSteps steps={storefrontContent.steps} />
      <div className="flex flex-wrap gap-5">
        <Link to="/productos" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 py-3 text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">Ver productos</Link>
        <Link to="/contacto" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">Contactanos</Link>
      </div>
    </div>
  )
}
