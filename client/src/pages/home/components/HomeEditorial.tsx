import { Link } from 'react-router-dom'
import { storefrontContent } from '@/content/storefront-content'

export function HomeEditorial() {
  const content = storefrontContent.editorial
  return (
    <section aria-labelledby="home-editorial" className="grid gap-8 bg-accent px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{content.eyebrow}</p>
        <h2 id="home-editorial" className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{content.title}</h2>
      </div>
      <div className="flex flex-col items-start gap-5">
        <p className="max-w-prose text-lg leading-relaxed">{content.description}</p>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{content.note}</p>
        <Link to={content.href} className="inline-flex min-h-11 items-center gap-8 font-medium text-primary underline underline-offset-8 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">{content.ctaLabel}<span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  )
}
