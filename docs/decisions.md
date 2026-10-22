# Decisiones

## DEC-001 — React for MVP
Decisión: React + TypeScript + Vite. Razón: equipo familiarizado con el stack y velocidad de validación. Consecuencia: evaluar Astro solo si mediciones reales justifican un cambio.

## DEC-002 — Storefront repository independent from Cajora
Decisión: repositorio independiente que consume Cajora Public API. Razón: separar experiencia pública de administración. Consecuencia: sin dependencias del frontend administrativo.

## DEC-003 — Neutral brandable design
Decisión: tokens semánticos sin identidad final. Razón: branding pendiente. Consecuencia: ajustar identidad posteriormente sin reescribir componentes.

## DEC-004 — Feature-based frontend architecture
Decisión: `app / pages / features / shared / config`. Razón: responsabilidades próximas a cada capacidad. Consecuencia: crear carpetas solo cuando exista implementación real.

## DEC-005 — Pragmatic Clean Architecture
Decisión: separar responsabilidades/fronteras sin ceremonia. Razón: claridad y testabilidad sin capas vacías. Consecuencia: abstraer únicamente problemas concretos.

## DEC-006 — Cart is frontend-only in MVP
Decisión: Zustand + localStorage. Razón: MVP sin backend de órdenes. Consecuencia: carrito local, sin reservas ni pedidos persistidos en servidor.

## DEC-007 — WhatsApp is initial conversion endpoint
Decisión: carrito genera mensaje y abre WhatsApp. Razón: conversión simple. Consecuencia: flujo web termina en el handoff y la venta se registra manualmente en Cajora.

## DEC-008 — Future content systems stay separable
Decisión: blog posible con API/DB propias. Razón: independencia del contenido y el comercio. Consecuencia: múltiples clientes HTTP por dominio, sin mezclar datos con Cajora.

## DEC-009 — WhatsApp contact configured by environment for MVP
Decisión: configurar el contacto mediante VITE_WHATSAPP_NUMBER con validación lazy. Razón: CatalogBusiness todavía no publica contacto y existe un único Storefront comercial; evita acoplar Cajora a una necesidad aún no multi-tenant pública. Consecuencia: el número es público y puede migrarse posteriormente a configuración del negocio/API sin cambiar el dominio del carrito.


## DEC-010 — VITRUNO definitive brand identity
Decisión: VITRUNO es la identidad pública definitiva. Logo horizontal e isotipo V rasterizados suministrados, paleta #192C3D / #F4F0E8 / #2D9B90 / #E6B85C y blanco auxiliar. Manrope en headings e Inter en body/UI. Sustituye el estado pendiente de DEC-003.

Razón: identidad aprobada para una tienda multirrubro moderna, cercana y de calidad accesible, sin posicionamiento luxury ni discount.

Consecuencia: identidad centralizada en assets locales, tokens semánticos y contenido; BrandLogo reutiliza los PNG sin reconstrucción. El maestro disponible es raster, no SVG. business.name/logoUrl permanecen en el contrato Cajora, pero no reemplazan la marca pública. Google Fonts mediante links con swap/fallback, sin dependencia npm. Manifest display browser, sin service worker ni declaración PWA. icon-192.png mide 180×180: se declara su medida real y no se sobrescribe el original.


## DEC-011 — VITRUNO visual redesign / editorial storefront
Decisión: sustituir la identidad cromática de DEC-010 por Tech contemporánea: fondo #FAFAFC, foreground/superficie oscura #242038, primary #6547BE, accent lavanda #EAE6F7 y cards blancas. Logo propuesta 3 suministrado con V en degradado y wordmark blanco. Manrope/Inter se conservan.

Razón: nueva identidad aprobada y composición ecommerce más editorial, proporcional a un catálogo pequeño y multirrubro. Bellroy es referencia conceptual de ritmo, jerarquía y fotografía, sin copia de assets, branding, textos o componentes.

Consecuencia: Header/Footer oscuros compatibles con el PNG opaco, página clara sin dark mode global. Mobile usa isotipo accesible por legibilidad; desktop y Footer conservan horizontal completo. Hero muestra portada del primer producto ya cargado cuando existe, sin semántica featured ni requests extra; fallback con isotipo. Categorías/productos preceden un único bloque editorial. Se retira la referencia al ICO anterior y se integra OG local con URL conocida https://vitruno.onrender.com/og-image.png. DEC-010 y F12 permanecen como historia; no se alteran contratos ni reglas comerciales.

## DEC-012 — Paneles accesibles con estado UI separado
Decisión: adaptar Dialog del paquete @base-ui/react existente en shared/ui/SidePanel y componer menú/carrito en app, con store UI no persistido y carga diferida del panel. El carrito v3 y la verificación de /carrito siguen siendo las únicas fuentes comerciales.

Razón: menú y preview necesitan el mismo comportamiento modal accesible; separar visibilidad de los snapshots evita aperturas por hidratación/reconciliación. Reutilizar la dependencia instalada evita un focus trap artesanal y paquetes adicionales.

Consecuencia: Header/shared reciben datos y callbacks; solo el clic en Carrito abre el preview. El panel no verifica ni finaliza compras. Tras la corrección visual solicitada, el shell ocupa todo el ancho con scroll natural; se retira el acceso flotante y su espacio reservado. Contacto tiene entrada pública secundaria en WhatsApp para diferir el formulario sin mezclar su mensaje con checkout o consulta de producto.
