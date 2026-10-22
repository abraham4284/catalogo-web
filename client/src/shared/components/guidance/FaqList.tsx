export function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="min-w-0 divide-y border-t">
      {items.map((item) => (
        <details key={item.question} className="py-1">
          <summary className="min-h-11 cursor-pointer py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{item.question}</summary>
          <p className="max-w-prose pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
