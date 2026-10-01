import { useState } from 'react'

type CatalogImageProps = { src: string | null; alt: string; loading?: 'lazy' | 'eager' }

function ImageFallback() {
  return <span className="px-3 text-center text-sm text-muted-foreground">Sin imagen</span>
}

function LoadedCatalogImage({ src, alt, loading }: CatalogImageProps & { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <ImageFallback />
  return <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} className="h-full w-full object-contain" />
}

export function CatalogImage({ src, alt, loading }: CatalogImageProps) {
  return src ? <LoadedCatalogImage key={src} src={src} alt={alt} loading={loading} /> : <ImageFallback />
}
