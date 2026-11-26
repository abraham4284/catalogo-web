import { MapPinIcon } from '@phosphor-icons/react/dist/csr/MapPin'
import { ClockIcon } from '@phosphor-icons/react/dist/csr/Clock'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { FacebookLogoIcon } from '@phosphor-icons/react/dist/csr/FacebookLogo'
import { InstagramLogoIcon } from '@phosphor-icons/react/dist/csr/InstagramLogo'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { storefrontContent } from '@/content/storefront-content'
import { trackContact } from '@/features/analytics'
import { WhatsAppContactForm } from '@/features/whatsapp/contact'
import { getWhatsAppGeneralInquiryHref } from '@/features/whatsapp/utils/whatsapp-general-inquiry'

const rowClass = 'flex min-h-11 min-w-0 items-start gap-3 rounded-lg py-5 text-sm'
const linkClass = `${rowClass} group hover:text-primary focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4`

const socialLinks = [
  { label: 'Instagram', href: storefrontContent.social.instagram, Icon: InstagramLogoIcon },
  { label: 'Facebook', href: storefrontContent.social.facebook, Icon: FacebookLogoIcon },
]

export function ContactPage() {
  const whatsappHref = getWhatsAppGeneralInquiryHref()
  const location = storefrontContent.physicalStore
  const whatsappContent = <>
    <WhatsappLogoIcon size={24} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
    <div className="min-w-0 space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">WhatsApp</h3>
      {whatsappHref ? <>
        <p className="font-semibold group-hover:underline">Consultanos por WhatsApp</p>
        <p className="leading-relaxed text-muted-foreground">Compras, disponibilidad y asesoramiento</p>
        <span className="sr-only">Abre en una nueva pestaña</span>
      </> : <p className="leading-relaxed text-muted-foreground">El contacto por WhatsApp no está disponible en este momento.</p>}
    </div>
  </>

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Contacto</h1>
        <p className="text-muted-foreground">Visitá nuestro local en Tucumán o escribinos por WhatsApp. Estamos para ayudarte.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-labelledby="contact-channels" className="min-w-0 space-y-2 self-start rounded-xl border bg-accent/40 p-5 sm:p-8">
          <h2 id="contact-channels" className="text-xl font-semibold">Encontranos</h2>
          <div className="divide-y">
            <a href={location.mapsHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <MapPinIcon size={24} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ubicación</h3>
                <p className="text-base font-semibold group-hover:underline">{location.address}</p>
                <p className="leading-relaxed text-muted-foreground">{location.city}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">Ver en Google Maps <ArrowUpRightIcon size={14} aria-hidden="true" /></span>
                <span className="sr-only">Abre en una nueva pestaña</span>
              </div>
            </a>
            <div className={rowClass}>
              <ClockIcon size={24} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Horarios de atención</h3>
                <p className="font-semibold">{location.days}</p>
                <p className="text-muted-foreground">{location.hours}</p>
              </div>
            </div>
            {whatsappHref ? <a href={whatsappHref} onClick={() => trackContact('contact_page')} target="_blank" rel="noopener noreferrer" className={linkClass}>{whatsappContent}</a> : <div className={rowClass}>{whatsappContent}</div>}
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
