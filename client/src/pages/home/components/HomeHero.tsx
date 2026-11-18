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
      <div className="relative isolate overflow-hidden rounded-2xl border border-primary/15 bg-[var(--hero-surface)] [--hero-surface:color-mix(in_srgb,var(--accent)_58%,var(--card))] md:flex md:min-h-94 md:items-center">
        <div className="relative z-10 space-y-5 p-5 sm:p-8 md:w-[57%] lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-primary">{hero.eyebrow}</p>
          <h1 id="home-title" className="max-w-[14ch] text-[1.85rem] leading-[1.08] font-semibold tracking-tight sm:text-4xl lg:text-5xl">{hero.title}</h1>
          <p className="max-w-[43ch] text-sm leading-relaxed text-foreground lg:text-base">{hero.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={hero.href} className={`${button} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {hero.ctaLabel}<ArrowRightIcon size={16} aria-hidden="true" />
            </Link>
            <a href="#como-comprar" className={`${button} border border-input bg-card hover:bg-accent`}>Cómo comprar</a>
          </div>
        </div>
        <img src={hero.image} alt="" width={1920} height={1080} fetchPriority="high"
          className="block h-auto w-full md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[78%] md:object-cover md:object-right" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,var(--hero-surface)_35%,transparent_60%)] md:block" />
      </div>

      <div className="mt-4 divide-y rounded-xl border bg-card px-4 sm:px-6">
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
