import { FacebookLogoIcon } from '@phosphor-icons/react/dist/csr/FacebookLogo'
import { InstagramLogoIcon } from '@phosphor-icons/react/dist/csr/InstagramLogo'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { storefrontContent } from '@/content/storefront-content'
import { trackContact } from '@/features/analytics'
import { WhatsAppContactForm } from '@/features/whatsapp/contact'
import { getWhatsAppGeneralInquiryHref } from '@/features/whatsapp/utils/whatsapp-general-inquiry'

const socialLinks = [
  { label: 'Instagram', href: storefrontContent.social.instagram, Icon: InstagramLogoIcon },
  { label: 'Facebook', href: storefrontContent.social.facebook, Icon: FacebookLogoIcon },
]

export function ContactPage() {
  const whatsappHref = getWhatsAppGeneralInquiryHref()

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Contacto</h1>
        <p className="text-muted-foreground">¿Tenés una consulta? Estamos para ayudarte.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-labelledby="contact-channels" className="min-w-0 space-y-6 self-start rounded-xl border bg-accent/40 p-5 sm:p-8">
          <h2 id="contact-channels" className="text-xl font-semibold">Hablemos</h2>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">
              <WhatsappLogoIcon size={20} className="shrink-0" aria-hidden="true" />
              Consultar por WhatsApp
            </a>
          )}
          <div className="space-y-2 border-t pt-5">
            <h3 className="font-semibold">Atención online</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">Coordinamos compras y consultas online. Hacemos envíos a todo el país.</p>
          </div>
          <div className="space-y-2 border-t pt-5">
            <h3 className="font-semibold">Seguinos</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
                    <Icon size={20} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section aria-labelledby="contact-message-heading" className="min-w-0 space-y-4 rounded-xl border bg-card p-5 sm:p-8">
          <h2 id="contact-message-heading" className="text-xl font-semibold">Envianos un mensaje</h2>
          <p className="text-sm text-muted-foreground">Completá el formulario para continuar por WhatsApp.</p>
          <WhatsAppContactForm onContact={() => trackContact('contact_page')} />
        </section>
      </div>
    </div>
  )
}
