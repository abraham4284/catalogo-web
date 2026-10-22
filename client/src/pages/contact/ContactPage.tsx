import { WhatsAppContactForm } from '@/features/whatsapp/contact'

export function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Contacto</h1>
      <p className="max-w-prose leading-relaxed text-muted-foreground">¿Tenés una consulta? Contanos qué necesitás y continuemos por WhatsApp. El email es opcional.</p>
      <WhatsAppContactForm />
    </div>
  )
}
