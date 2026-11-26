const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d529.1384643424983!2d-65.20807022770543!3d-26.852509772553784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225b7833ffa62f%3A0x5e921ae258ac1a0e!2sVitruno!5e0!3m2!1ses-419!2sar!4v1795653649669!5m2!1ses-419!2sar'

export function StoreLocationMap() {
  return (
    <section aria-labelledby="store-location-title" className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <h2 id="store-location-title" className="text-2xl font-semibold">Visitá VITRUNO</h2>
      <p className="mt-2 text-sm text-background/80">Encontranos en San Miguel de Tucumán</p>
      <div className="mt-4 h-64 overflow-hidden rounded-2xl border border-background/20 bg-background/10 sm:h-72 lg:h-80">
        <iframe
          src={GOOGLE_MAPS_EMBED_URL}
          title="Ubicación de VITRUNO en Google Maps"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-background/70">Si el mapa no se muestra, comprobá si tu navegador permite contenido de Google Maps.</p>
    </section>
  )
}
