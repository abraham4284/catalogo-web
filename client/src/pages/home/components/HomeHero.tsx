import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { PackageIcon } from '@phosphor-icons/react/dist/csr/Package'
import { TruckIcon } from '@phosphor-icons/react/dist/csr/Truck'
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/csr/WhatsappLogo'
import { storefrontContent } from '@/content/storefront-content'

const focus = 'focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4'
const button = `inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${focus}`
const benefitIcons = [WhatsappLogoIcon, TruckIcon, PackageIcon] as const

export function HomeHero() {
  const hero = storefrontContent.hero

  return (
    <section aria-labelledby="home-title">
      <div className="relative isolate overflow-hidden rounded-2xl border border-primary/15 bg-[var(--hero-surface)] [--hero-surface:color-mix(in_srgb,var(--accent)_58%,var(--card))] md:flex md:min-h-76 md:items-center">
        <div className="relative z-10 space-y-3 p-4 sm:p-6 md:w-[57%] lg:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary sm:text-xs">{hero.eyebrow}</p>
          <h1 id="home-title" className="max-w-[16ch] text-2xl leading-[1.08] font-semibold tracking-tight sm:text-3xl lg:text-4xl">{hero.title}</h1>
          <p className="max-w-[43ch] bg-[var(--hero-surface)] text-sm leading-relaxed text-foreground sm:bg-transparent"><span className="sm:hidden">{hero.mobileDescription}</span><span className="hidden sm:inline">{hero.description}</span></p>
          <div className="flex flex-wrap gap-3">
            <Link to={hero.href} className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {hero.ctaLabel}<ArrowRightIcon size={16} aria-hidden="true" />
            </Link>
            <a href="#como-comprar" className={`${button} border border-input bg-card hover:bg-accent`}>Cómo comprar</a>
          </div>
        </div>
        <img src={hero.image} alt="" width={1920} height={1080} fetchPriority="high"
          className="absolute right-0 top-0 h-40 w-[52%] object-cover object-right sm:h-full sm:w-[65%] md:inset-y-0 md:w-[78%] md:object-contain" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--hero-surface)_48%,transparent_90%)] sm:bg-[linear-gradient(90deg,var(--hero-surface)_38%,transparent_75%)] md:bg-[linear-gradient(90deg,var(--hero-surface)_35%,transparent_60%)]" />
      </div>

      <div className="mt-3 hidden divide-y rounded-xl border bg-card px-4 lg:block sm:px-6">
        <ol aria-label="Cómo comprar" className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 text-sm font-medium">
          {hero.buyingSteps.map((step, index) => (
            <li key={step} className="inline-flex items-center gap-3">
              {index > 0 && <ArrowRightIcon size={14} className="shrink-0 text-primary" aria-hidden="true" />}
              {step}
            </li>
          ))}
        </ol>
        <ul aria-label="Servicios de VITRUNO" className="flex flex-wrap gap-x-7 gap-y-2 py-3 text-sm text-muted-foreground">
          {hero.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index]
            return <li key={benefit} className="flex items-center gap-2"><Icon size={18} className="shrink-0 text-primary" aria-hidden="true" />{benefit}</li>
          })}
        </ul>
      </div>
    </section>
  )
}
