import { Link } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'
import { FaqList } from '@/shared/components/guidance/FaqList'

export function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Preguntas frecuentes</h1>
      <p className="text-muted-foreground">Encontrá información sobre consultas, encargos, disponibilidad, envíos y medios de pago.</p>
      <FaqList items={storefrontContent.faq} />
      <Link to="/contacto" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">¿Tenés otra consulta? Contactanos</Link>
    </div>
  )
}
