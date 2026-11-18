import { storefrontContent } from '@/content/storefront-content'

export function HomeOpeningBanner() {
  const content = storefrontContent.homeOpening
  return (
    <section aria-labelledby="home-opening" className="grid overflow-hidden rounded-xl border bg-accent lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-2 self-center p-5 sm:p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{content.eyebrow}</p>
        <h2 id="home-opening" className="text-xl leading-tight font-semibold sm:text-2xl">{content.title}</h2>
        <p className="text-sm text-muted-foreground">{content.description}</p>
      </div>
      <img src={content.image} alt="" width={1584} height={396} loading="lazy" className="block h-auto w-full lg:h-full lg:object-cover lg:object-center" />
    </section>
  )
}
