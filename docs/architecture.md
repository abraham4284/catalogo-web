# Arquitectura

Storefront independiente del frontend administrativo de Cajora. Frontera externa: Storefront → Cajora Public API → DB_COMERCIO. Puede consumir otras APIs independientes.

## Estructura objetivo (crecimiento orgánico)

```text
src/
├── app/                         # App, router, providers globales reales
├── pages/                       # home, catalog, product, not-found
├── features/
│   ├── catalog/                 # api, components, hooks, schemas, types
│   ├── cart/                    # components, store, domain, hooks, types
│   ├── search/
│   └── whatsapp/
├── shared/
│   ├── api/
│   ├── components/              # layout, ui (shadcn)
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── config/
├── assets/
├── index.css
└── main.tsx
```

Este árbol describe responsabilidades futuras, no carpetas que deban crearse vacías. F0 materializa `app`, `pages/home`, `pages/not-found`, `shared/components/ui` y `shared/lib`. `config`, providers, APIs y features se crean cuando exista código real.

## Responsabilidades
- `app`: composition root, App, Router y providers necesarios; sin dominio.
- `pages`: composición de features; sin Axios directo, reglas de carrito ni infraestructura.
- `features`: código específico de una capacidad. Feature-specific code stays inside the feature. Un blog futuro tendrá su propia feature.
- `shared`: solo reutilización genuina entre features; no un cajón de archivos.
- `shared/components/ui`: primitives genéricas/shadcn. ProductCard, CartDrawer y CategoryFilter pertenecen a sus features.
- `config`: configuración real de la aplicación, sin placeholders.

## Fronteras HTTP
Separar clientes HTTP por dominio externo:

```text
features/catalog → catalog API module → catalogHttp → Cajora Public API
features/blog    → blog API module    → blogHttp    → Blog API (futuro)
```

React nunca llama Axios directamente. No crear un cliente global acoplado exclusivamente a Cajora.

F2 implementa `shared/api/catalog-http.ts` (Axios lazy, timeout 15 s, sin credenciales ni Authorization) y `features/catalog/api/catalog.api.ts` (cuatro funciones async; input y envelope validados, retorno solo de data). Schemas en `features/catalog/schemas/catalog.schemas.ts`; tipos derivados en `types/catalog.types.ts`; exportaciones públicas en `features/catalog/index.ts`.

`catalog.error.ts` normaliza INVALID_INPUT, INVALID_RESPONSE, HTTP y NETWORK. Los fallos HTTP con body ajeno al contrato son INVALID_RESPONSE y conservan statusCode. Cancelaciones conservan `isCancelled` sin añadir otro código; las funciones admiten AbortSignal opcional. Los mensajes backend/fieldErrors son internos: `catalog-presentation-error.ts` proporciona mensajes seguros. Loading/error/empty son primitives accesibles usadas por las páginas.

`useCatalogHome` obtiene negocio, categorías y primeros 8 productos en paralelo. `useCatalogListing` carga categorías al montar y productos (24 por página) por query mediante efectos/controladores independientes. Expone estados separados para mantener filtros visibles al consultar productos y tratar fallos de categorías sin bloquear resultados. Los efectos cancelan mediante AbortController; callbacks obsoletos no publican datos/errores y el listado oculta datos de otra query. Sin cache global ni fetching desde componentes visuales.

`catalog-url.ts` centraliza parsing seguro y construcción de enlaces para search/categoria/page (categorySlug hacia API). La URL es la fuente de verdad; cambios de búsqueda/categoría reinician página, paginación conserva filtros. Los parámetros manuales inválidos se normalizan antes de consultar. Si una respuesta exitosa confirma page > totalPages, CatalogPage usa Navigate con replace a la última página válida conservando filtros. Pages consumen exclusivamente el barrel público de la feature. `CatalogPaginationControls` es el nombre público del componente, separado del tipo DTO `CatalogPagination`.

`catalog-product-route.ts` valida slugs mediante catalogSlugSchema antes de montar el fetching; DTOs y query reutilizan el mismo schema (máximo 180, patrón lowercase segmentado, sin normalización). getCatalogProductBySlug valida antes de HTTP y solicita /catalog/products/:slug. `useCatalogProduct` asocia resultados al slug solicitado y aborta al cambiar/desmontar; mantiene CatalogRequestState con reason opcional not-found para HTTP 404. La página monta contenido por slug para reiniciar datos y selección de imágenes.

`catalog-gallery.ts` construye portada y galería ordenada/deduplicada sin mutar el DTO. ProductGallery recibe solo nombre, portada y galería, controla miniaturas accesibles y reserva aspect ratio. `shared/components/media/ProductImage.tsx` comparte fallback de imágenes ausentes/rotas entre catalog y cart; su estado se reinicia al cambiar URL. ProductCardImage gestiona exclusivamente la secundaria opcional del listado: hover con puntero fino, transición reducida/omitida según reduced-motion y retirada de la secundaria rota para conservar portada.

F9 separa schema base de producto (incluye stockAvailable entero no negativo), listado (+secondaryImageUrl nullable) y detalle (+gallery y richContent nullable, sin requerir secundaria). `catalog-rich-content.schemas.ts` valida version literal 1 y union discriminada heading/paragraph/list/specs. Tipos derivados mediante z.infer. F10A agrega slug a producto/categoría, saleMode, availabilityStatus y availabilityNote, eliminando available del DTO. getCatalogAvailabilityLabel presenta exclusivamente el estado backend; stock físico y saleMode no lo recalculan. Rich content incorpora límites públicos de bloques/textos/items. No se muestra stock exacto ni se consultan detalles desde cards.

ProductCard acepta actions ReactNode, con imagen/nombre como enlaces separados y acciones fuera de ellos. ProductGrid acepta renderActions. Home/Catalog y ProductDetailPage componen `app/compositions/ProductCommerceActions.tsx` a través de barrels de catalog/cart/whatsapp. El componente reconcilia snapshots al recibir datos mediante efecto con dependencias escalares y sin requests. ProductDetail mantiene actions; availabilityNote no vacía se muestra como texto plano para cualquier estado; description introduce el producto y ProductRichContentRenderer genera h2/h3/p/ul/ol/dl debajo de la zona principal, sin HTML externo ni lógica de compra.

Pruebas de frontera sin red: desde `client/`, `node --test tests/catalog.test.cjs`. Usan TypeScript instalado para cargar módulos en memoria y un adaptador Axios simulado, sin dependencias adicionales.

## Carrito local
Zustand + localStorage v3, clave catalogo-web-cart. Snapshot idProduct/slug/name/price/imageUrl/availabilityStatus/stockAvailable y quantity; sin booleano legacy ni campos comerciales ajenos. v1/v2/futuras, JSON corrupto, IDs/slugs duplicados y campos inválidos producen vacío seguro; storage bloqueado/lleno conserva memoria usable. Solo in_stock con stock >= 1 agrega, incrementa hasta el último stock conocido y decrementa con mínimo 1. Re-agregar actualiza snapshot; reconcile preserva quantity y evita writes idénticos. Imagen/nombre forman un único enlace /productos/<slug>. Agotado/encargo permanecen visibles con cantidad deshabilitada; exceso de quantity mantiene aviso, permite disminuir/eliminar y bloquea checkout.

Revalidación coordinada en app/compositions: al montar /carrito con items, cambiar el conjunto idProduct+slug o reintentar. Una request concurrente por item a getCatalogProductBySlug, sin Axios en páginas ni acoplar Cart a Catalog. Verifica ID/slug de respuesta; identidad distinta, nombre vacío, 404 ambiguo, red/error HTTP o contrato inválido conservan snapshot y marcan fallo. Éxitos parciales actualizan precio/nombre/imagen/status/stock. AbortController y comprobación del conjunto actual impiden reconciliar corridas obsoletas. Quantity, reconcile y renders no disparan requests. Estado runtime loading/success/error con failedProductIds y retry, sin persistencia.

CartPage permite WhatsApp solo con verificación success e isCartReadyForInquiry(items). Loading bloquea con estado accesible; error bloquea con mensaje seguro global/por fila y Reintentar verificación; success con inconsistencias mantiene bloqueo. toCartSnapshot en app/compositions/catalog-cart-snapshot.ts selecciona únicamente campos v3 para agregado y revalidación. ProductCommerceActions conserva reconciliación de productos recibidos sin HTTP. Cart define su propio enum de disponibilidad; shared/schemas/public-slug.ts comparte solo el primitive de slug con Catalog. Sin polling ni reservas; cantidades enteras/paso 1. Pruebas reales de Zustand y servicio asíncrono: node --test tests/cart.test.cjs.

## WhatsApp handoff
CartPage compone cart y whatsapp mediante sus barrels públicos; las features no se importan entre sí. WhatsAppCheckoutItem define solo nombre/precio/cantidad. `domain/whatsapp-message.ts` construye texto determinista con nombres normalizados y formatter monetario compartido; `utils/whatsapp-url.ts` valida destino y codifica el mensaje con encodeURIComponent.

`utils/whatsapp-checkout.ts` une configuración lazy y funciones puras, devolviendo undefined ante carrito vacío, configuración inválida o mensaje no generable. WhatsAppCheckoutLink renderiza un enlace real wa.me con target=_blank y rel=noopener noreferrer, o CTA deshabilitado con mensaje seguro. Sin llamadas HTTP, datos personales adicionales ni limpieza del carrito. Pruebas puras/configuración: `node --test tests/whatsapp.test.cjs`.

Consulta individual F10A: WhatsAppProductInquiry contiene solo name/price/availabilityStatus y usa el union propio WhatsAppInquiryAvailability; no importa Catalog. buildWhatsAppProductInquiryMessage produce mensaje normalizado para consulta normal, disponibilidad o condiciones del encargo. ProductInquiryLink reutiliza URL/configuración lazy y cambia label según disponibilidad; sin configuración usa estado neutral/deshabilitado. No incluye stock ni IDs, no agrega/limpia carrito ni consulta backend. El gate de coherencia del carrito pertenece a CartPage/cart, sin acoplar WhatsApp a cart.

## Clean Architecture pragmática
Flujo conceptual: UI → Application / Feature logic → Domain rules → Infrastructure boundary. Las reglas puras de dominio no importan React, Axios ni almacenamiento; los módulos de infraestructura adaptan contratos externos. Separar responsabilidades sin interfaces/capas vacías.

## Baseline F0
StoreRoute, en app, compone StoreLayout y mueve el foco a main-content únicamente al cambiar pathname. No reacciona a query/hash ni modifica el foco del montaje inicial; el skip link mantiene navegación nativa al main enfocable.

`main.tsx` monta `app/App.tsx`; App entrega el router con rutas `/` y `*`. Home y Not Found son mínimas. Alias `@/*` apunta a `src/*` en TypeScript y Vite; shadcn genera UI y utilidades dentro de `shared`. Se mantiene el preset existente, incluidos sus radios explícitos, sin refactor visual.

ESLint permite la exportación `buttonVariants` únicamente en el botón shadcn para conservar su contrato generado; la regla de Fast Refresh sigue activa para los demás archivos.

## F16 — Navegación y paneles
StoreRoute deriva unidades/total desde Cart y entrega datos/callbacks a StoreLayout/Header. Shared no importa features. `app/storefront-ui.store.ts` mantiene exclusivamente panel activo, último contenido y elemento de retorno; no usa persistencia ni duplica el carrito comercial. Solo el botón Carrito del Header invoca openCart; AddToCartButton y ProductCommerceActions no dependen del estado del panel. Agregado/reconcile/hidratación/revalidación no abren paneles.

Tras corregir la primera apertura, StorePanels se importa de forma síncrona y se monta siempre cerrado desde StoreRoute; compone CartPreview, exportado por el barrel de Cart, o navegación compacta. SidePanel adapta Dialog de Base UI ya instalado: modal, portal, backdrop, scroll/focus management y Escape. El destino de foco se consulta al cerrar; cerrar normalmente devuelve al disparador, usa el botón Carrito del Header si el disparador dejó de estar disponible y navegar entrega foco al contenido. Los IDs de filas de preview tienen prefijo propio. CartPreview reutiliza filas, acciones y reglas del mismo store v3; no hace fetching ni genera checkout. /carrito conserva la única coordinación de revalidación y el gate de WhatsApp.

StoreLayout ocupa todo el ancho y usa el scroll natural del documento. No hay carril derecho, banda inferior ni acceso flotante. El Dialog cerrado no participa del layout. Header oculta el importe bajo lg y conserva la cantidad. Menú completo desde xl; debajo usa el mismo Dialog.

Las tres páginas nuevas son lazy. BuyingSteps/FaqList reciben los arrays existentes de storefrontContent y se reutilizan en Home. WhatsApp expone la entrada pública secundaria `features/whatsapp/contact.ts` para mantener el formulario en su chunk de ruta. Schema Zod valida/normaliza nombre, email opcional y mensaje; dominio compone texto propio y helper une configuración/URL existentes. El formulario conserva valores solo en memoria y abre una ventana con noopener/noreferrer después de validar, con enlace de recuperación por si el navegador bloquea el popup. No accede a Cajora ni al carrito ni guarda datos personales.

### Transición del panel
El store UI conserva contentPanel separado de panel: cerrar cambia únicamente visibilidad y mantiene título/contenido durante la transición de salida. Los atributos de transición de Dialog Base UI determinan entrada/salida y desmontaje; CSS usa transform/opacity y desactiva movimiento con prefers-reduced-motion. No afecta snapshots, persistencia ni revalidación.

## F17 — Preload y feedback efímero
La precarga inicial de F17 fue sustituida tras reproducir la primera apertura sin transición: descargar el módulo no inicializaba Dialog.Root. StorePanels ahora se importa de forma síncrona y se monta desde el primer render con open=false. Se eliminan lazy/Suspense, loader y hasOpened para este control crítico; las rutas de páginas mantienen lazy. Dialog.Root no genera HTML y su Portal cerrado no monta popup/backdrop, por lo que no ocupa espacio, bloquea scroll ni captura foco. El clic solo cambia open de un diálogo ya inicializado, sin esperar imports ni primer montaje abierto.

StoreRoute monta un único FeedbackToaster (shared/ui), adaptado a react-hot-toast solicitado por el usuario. No requiere Provider por card ni contexto adicional. El helper UI showCartAddedToast de Cart construye título/nombre/check y usa un ID estable para actualizar una notificación sin apilar. AddToCartButton compara quantity antes/después del addItem existente; solo un incremento activa toast/etiqueta. El estado local de feedback tiene timeout limpiado al desmontar y no se persiste. No se alteran store/dominio/schema/reconcile/revalidación ni API. La adaptación visual y aria se mantienen en shared; el copy de agregado pertenece a Cart.

## F18 — Transición y prefetch por intención
StoreLayout envuelve únicamente Outlet con route-enter y key=pathname. Main y su tabIndex quedan fuera; StoreRoute conserva el efecto de cierre de paneles/foco. Los cambios de query conservan el wrapper/página. Las rutas mantienen lazy.

app/route-loaders.ts contiene los imports dinámicos reutilizados por router y navigation-prefetch.ts. El mapping permite únicamente /productos, /contacto, /como-comprar y /preguntas-frecuentes; detalle sigue lazy sin prefetch de datos. Header y Footer reciben un callback onPrefetchRoute desde app y no importan pages ni app. StorePanels, ya en app, usa el mismo callback de prefetch. Solo pointerenter/focus disparan descargas; no hay efecto global ni store para esta función.

Un fallo de descarga de módulo puede quedar retenido en la caché de módulos del navegador: se reprodujo al abortar un prefetch. createRecoverablePageLoader conserva una bandera privada de fallo y permite que la próxima carga use el mismo componente con URL de recuperación distinta (?navigation-retry). Vite genera cuatro pequeños chunks alternativos, solicitados solo después de un fallo; dependencias pesadas compartidas no se duplican. La vía normal no hace retries ni descargas adicionales. Las declaraciones route-retry.d.ts conservan los tipos reales, sin any. Rechazos del prefetch se capturan; fallo persistente al navegar se propaga al manejo normal de React Router, sin loops ni reload global.

## F19 — SEO de SPA sin dependencia nueva
Las rutas tienen IDs estables para seleccionar metadata estática en app/compositions/RouteSeo a partir de useMatches. El ID product delega al detalle, que reutiliza su hook/estado ya existente y un helper puro local product-seo.ts. Hay un único propietario SEO activo: composición de rutas públicas o ficha de producto. No se añade fetching ni se acopla shared a Catalog.

shared/components/seo/Seo aplica metadata al head mediante efecto; shared/seo/seo-dom.ts actualiza/reutiliza tags del fallback index.html y elimina duplicados de description/canonical/robots/OG/Twitter. Cada estado escribe el conjunto completo y retira Product JSON-LD si no corresponde. Evita mezclar tags React 19 hoisted con fallback estático duplicado; no requiere Helmet ni otra librería. Los helpers puros fijan el host, normalizan texto/URLs de imagen y serializan JSON-LD escapando < y separadores Unicode. Se usa textContent, sin HTML del backend.

La ficha keyed por slug emite metadata genérica durante carga y noindex ante error/404; success usa slug real, no slugify. Offer solo con precio finito no negativo, ARS numérico, disponibilidad comercial sin inferir stock. Encargos conservan ficha indexable, sin afirmar disponibilidad concreta. Robots/sitemap son archivos públicos estáticos copiados por Vite; el build no depende de la API remota. Limitaciones SPA y pasos externos en docs/f19-validation.md.

## F20 — Analytics opt-in
features/analytics separa consentimiento Zustand (persistencia manual de una única cadena accepted/rejected) y transporte Meta. Shared Footer recibe callback desde app; no importa Analytics. AnalyticsConsent observa pathname/consent; ProductAnalytics en app observa únicamente producto cargado. Dedupe efímero por visita y producto resiste rerenders/StrictMode, sin contar queries; no se reproducen acciones anteriores a aceptar.

El loader valida ID/consentimiento y crea fbq/script/init una vez por documento; async, autoConfig=false, init sin datos de usuario y llamadas encapsuladas no-throw. Cola de compatibilidad SDK acotada a 100 llamadas; fallo de script desactiva tracking hasta recargar. No hay cola backend. Revocación detiene nuevas llamadas, envía revoke, vacía cola, retira script y recarga para eliminar SDK en memoria; fallo de storage implica volver a unknown en recarga, sin cargar Meta. Cambios de storage en otra pestaña se sincronizan.

AddToCartButton notifica onAdded tras la condición F17 before/after. app integra trackAddToCart; WhatsApp expone callbacks opcionales solo en enlaces válidos, sin imports entre features. CartPage conecta checkout en el branch ya validado. ContactPage conecta formulario; callback solo tras Zod y URL válidos (incluido enlace explícito para reabrir). Payloads construidos por listas explícitas de campos de producto/carrito o source, nunca objetos del formulario. Las URLs/mensajes y gates comerciales no se modifican.

## F21 — Skeletons y merchandising
Skeleton compartido en shared/ui, variantes de card/grid/detalle en Catalog. CatalogLoadingState conserva API pero pasa a grid con status oculto; la ficha usa ProductDetailSkeleton antes de success. Son solo loading: error, vacío y 404 conservan UI propia. Retry local en hooks de datos sin remontar shell ni animar por query. HydrateFallback selecciona skeleton de ficha/listado únicamente en rutas de datos; ayuda/contacto no reciben un loader visual de módulos.

useCatalogHome mantiene los tres requests existentes; expone heroLoading/heroProduct internos. Si el slug intencional está en Home se reutiliza. Si falta y existen productos, getFeaturedHeroProduct hace una ficha cancelable, cacheada 5 minutos en memoria. Home muestra las cards sin esperar ese request; el Hero conserva skeleton propio. No hay ProductAnalytics asociado al Hero ni requests por render.

merchandising-cache guarda hasta 200 productos por 60 s para reutilizar listados ya vistos y hasta 20 respuestas por categoría de relacionados (60 s). useRelatedProducts reutiliza categoría o al menos cuatro conocidos adecuados; de otro modo consulta una página de nueve por categorySlug, con AbortController y protección de respuesta obsoleta. Selector puro excluye ID/slug actual, filtra categoría y deduplica; máximo ocho, sin ranking artificial ni detalles por card. Error usa conocidos o sección oculta, sin afectar ficha/SEO.

ProductRecommendations vive en app y compone ProductCard + ProductCommerceActions públicos, seguido de FaqList. Conserva Analytics/stock/hover/WhatsApp de la card existente. No crea eventos de scroll. Selector FAQ y textos en storefront-content; F21B sustituye el cálculo 30/70 de la ficha por un aviso compacto y elimina el helper sin consumidores. WhatsApp mantiene contrato compatible con slug opcional para enlazar la ficha canónica. No hay pago web, backend nuevo ni cambios a Cart v3 o a la estrategia JSON-LD de encargos.


## F21B — FAQ jerárquica y WhatsApp global
FaqList admite unión tipada de entrada simple/grupo con hijos simples; renderiza details/summary anidados sin HTML inyectado. Copy y selección contextual siguen en storefront-content; el grupo global reemplaza las nueve entradas sueltas y la colección general es explícita, sin filtros por índice.

FloatingWhatsAppButton pertenece a WhatsApp y construye su enlace mediante getWhatsAppNumber/buildWhatsAppUrl; configuración inválida produce ausencia segura. StoreRoute lo integra una vez mediante FloatingWhatsAppContact, que coordina panel UI, consentimiento y estado del toaster público existente. ResizeObserver, MutationObserver del contenido y listeners scroll/resize/focus/fin de animación con requestAnimationFrame comprueban coincidencia con controles, sin polling, HTTP ni persistencia adicional. El botón cede espacio a las acciones; enlaces grandes de imagen de ProductCard quedan fuera de esta comprobación. Visibilidad oculta también retira el enlace de la tabulación. Captura de scroll incluye carruseles. Cleanup de observers/listeners/frame al desmontar o bloquear.

No se instrumenta Contact global en F21B: el origen vigente product_inquiry no corresponde a esta consulta general. No se añade evento ni se altera consentimiento o tracking existente. Icono importado desde su módulo Phosphor específico, sin dependencia nueva.
