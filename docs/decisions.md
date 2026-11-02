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

## DEC-013 — Notificación de agregado con react-hot-toast
Decisión: utilizar react-hot-toast 2.6.1 en lugar del Toast de Base UI para el feedback de agregado, siguiendo la nueva solicitud explícita del usuario. Reemplaza el criterio inicial F17 de no instalar esta librería y de mostrar notificación central.

Razón: tarjeta inferior con check, título y nombre del producto conforme a la referencia aprobada. Una única instancia FeedbackToaster en app con estilos compartidos; helper específico en Cart y ningún cambio al dominio persistido. Base UI permanece para Dialog/menú.

Consecuencia: nueva dependencia directa y goober transitiva, registradas en package-lock.json. El toast es efímero, polite y sin interacción; duración 3000 ms y un ID estable evita apilado. Se conserva la inicialización síncrona cerrada del Side Cart y el resto de las reglas comerciales.

## DEC-014 — Host SEO canónico y SEO de SPA
Decisión: usar exclusivamente https://vitruno.com.ar como host canónico y para OG de marca. Carrito y rutas inexistentes llevan noindex,follow; queries del catálogo canonicalizan a /productos. Se mantienen SPA/lazy routes; sin SSR/SSG ni dependencia adicional para head. El HTML inicial conserva fallback de Home y un helper reutiliza/actualiza esos tags al renderizar JS.

Razón: dominio aprobado y propiedad Search Console ya verificada por DNS según el usuario. El build debe funcionar sin consultar la API remota; por eso el sitemap inicial incluye las cinco rutas públicas estables y no inventa productos/lastmod.

Consecuencia: discovery de fichas reales mediante links del catálogo; sitemap de productos pendiente de generación confiable. La metadata de producto depende de JS; previews sin render JS pueden mostrar el fallback. En Product JSON-LD, in_stock→InStock y out_of_stock→OutOfStock. on_order es consulta de condiciones, sin garantía de reposición ni preventa: se omite availability en vez de afirmar InStock, BackOrder o PreOrder. Las fichas por encargo/agotadas siguen indexables si existen. Offer usa solo precio ARS real; sin SKU, ratings, marca comercial, envío o devoluciones inventados. Publicación/validación y solicitudes Search Console son manuales posteriores al deploy; no se toca DNS.

## DEC-015 — Meta Pixel solo tras aceptación explícita
Decisión: Pixel de navegador opcional desde env público, bloqueado en unknown/rejected, consentimiento versionado revocable; PageView solo por pathname. Sin Advanced Matching manual, init sin PII, autoConfig desactivado, sin CAPI ni Purchase. WhatsApp no acredita una venta.

Razón: medición solicitada sin cambiar comercio/DB ni enviar campos personales del formulario. Rechazar debe mantener el sitio operativo. SDK ya cargado no puede descargarse de forma fiable: revocar bloquea wrappers y recarga tras persistir rechazo. Payloads propios no incluyen PII; el SDK externo procesa identificadores técnicos/cookies/URL/referrer según su funcionamiento, por lo que no se hace una afirmación jurídica absoluta. Ajustes remotos de matching/eventos y política pública requieren revisión manual antes de producción.

## DEC-016 — Polish y compra por encargo
Decisión: Hero visual con slug lattafa-oud-for-glory, nombre Lattafa Oud For Glory confirmado en GET público local de Cajora el 2026-11-02. Reutilizar Home o una ficha cacheada si no aparece en los primeros ocho; fallback seguro. No se deriva slug ni se codifica imagen externa.

Relacionados por misma categoría con listado/caché, sin N+1; ProductCard existente, scroll snap sin autoplay. FAQ compacta = tres preguntas contextuales; copy compartido con FAQ global. on_order comunica anticipo estándar 30% del total acordado y saldo 70%, con redondeo a centavos; consultar no confirma compra. Encargo confirmado solo con aceptación expresa, condiciones y anticipo recibido; el proceso es manual por WhatsApp. Sin pagos/pedidos web ni nuevos eventos de venta.

La política comercial aprobada por F21 no es dictamen jurídico ni cambia automáticamente on_order a BackOrder en JSON-LD. Cancelación, garantías y mecanismos legales reales requieren revisión. No se limita universalmente devolución ni se declara anticipo no reembolsable.


## DEC-017 — Refinamiento de encargos y contacto global
F21B reemplaza el desglose numérico de la ficha por el aviso compacto del 30%; se elimina el cálculo sin consumidores. Mantiene la política 30/70 sobre precio final pactado, con cotización antes de pagar. FAQ global agrupada en una entrada con cuatro hijos y ficha on_order con una sola pregunta resumida; disponible/agotado conservan tres. Estas decisiones de presentación sustituyen las variantes de DEC-016, sin alterar contratos ni reglas de carrito.

WhatsApp flotante es consulta general, integrado una vez, con configuración existente y sin efectos al montar. Cede prioridad a paneles, cookies, toast y controles de página. Sin dependencia nueva ni Contact global en esta fase: no corresponde reutilizar product_inquiry para un origen general. Derechos y revisión jurídica/mecanismo real de arrepentimiento siguen pendientes; ningún botón ficticio ni cumplimiento legal declarado.
