type BuyingStepsProps = {
  steps: readonly { title: string; text: string }[]
  headingLevel?: 2 | 3
}

export function BuyingSteps({ steps, headingLevel = 2 }: BuyingStepsProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="space-y-3 border-t py-6">
          <span aria-hidden="true" className="text-sm font-medium text-muted-foreground">0{index + 1}</span>
          <Heading className="text-lg font-semibold">{step.title}</Heading>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
