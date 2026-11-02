export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`rounded-md bg-muted motion-safe:animate-pulse ${className}`} />
}
