import { BuyingSteps } from '@/shared/components/guidance/BuyingSteps'
import { FaqList } from '@/shared/components/guidance/FaqList'
import { storefrontContent } from '@/content/storefront-content'

export function HomeBuyingGuide() {
  return (
    <>
      <section id="como-comprar" aria-labelledby="buying-heading" className="scroll-mt-8 space-y-6 border-t pt-10">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Paso a paso</p>
          <h2 id="buying-heading" className="text-3xl font-semibold tracking-tight">Cómo comprar</h2>
        </div>
        <BuyingSteps steps={storefrontContent.steps} headingLevel={3} />
      </section>
      <section aria-labelledby="faq-heading" className="grid gap-6 border-t pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <FaqList items={storefrontContent.faq} />
      </section>
    </>
  )
}
