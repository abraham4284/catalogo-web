type BrandLogoProps = {
  variant?: 'horizontal' | 'mark'
  decorative?: boolean
  className?: string
}

const assets = {
  horizontal: { src: '/vitruno-logo-horizontal.png', width: 1600, height: 560 },
  mark: { src: '/vitruno-isotipo-512.png', width: 512, height: 512 },
} as const

export function BrandLogo({ variant = 'horizontal', decorative = false, className = '' }: BrandLogoProps) {
  return (
    <img
      {...assets[variant]}
      alt={decorative ? '' : 'VITRUNO'}
      aria-hidden={decorative || undefined}
      className={`block h-auto max-w-full shrink-0 object-contain ${className}`}
    />
  )
}
