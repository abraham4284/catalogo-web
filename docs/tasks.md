# Trabajo

## F0 — Foundation / repository governance
- [x] AGENTS.md
- [x] Documentación canónica
- [x] Limpieza scaffold
- [x] Estructura base mínima
- [x] Router baseline
- [x] Configuración neutral de UI
- [x] Lint
- [x] Build

## F1 — Application shell
- [x] StoreLayout, Header y Footer
- [x] Routing definitivo inicial y Not Found
- [x] Configuración runtime/env

## F2 — Cajora Public Catalog integration
- [x] HTTP client, schemas Zod, DTO types y catalog API
- [x] Categories, product list y product detail
- [x] Estados error/loading

## F3 — Home + Catalog
- [x] Fetching React para Home y catálogo
- [x] ProductCard y ProductGrid
- [x] Búsqueda y categorías mediante URL
- [x] Paginación
- [x] Estados loading/error/empty
- [x] Home con datos reales
- [x] CatalogPage con datos reales

## F4 — Product Detail + Gallery
- [x] Validación de idProduct y fetching de detalle
- [x] ProductDetail responsive
- [x] Galería con portada y thumbnails
- [x] Estados loading/error/producto no disponible
- [x] Navegación hacia catálogo y categoría
- [x] Corrección de página fuera de rango en catálogo

## F5 — Cart
- [x] Dominio y tipos del carrito
- [x] Zustand + localStorage con validación
- [x] Agregar producto desde detalle
- [x] CartPage y controles de cantidad
- [x] Totales y estado vacío
- [x] Ruta y navegación al carrito

## F6 — WhatsApp checkout handoff
- [x] Configuración pública de número WhatsApp
- [x] Generación pura del mensaje
- [x] Construcción segura de URL wa.me
- [x] CTA desde carrito
- [x] Manejo de configuración ausente
- [x] Pruebas del handoff

## F7 — Responsive / accessibility / performance
- [x] Auditoría responsive de shell y páginas (estructura; navegador sin configuración)
- [x] Navegación por teclado y focus management
- [x] Revisión semántica/ARIA
- [x] Robustez ante contenido largo
- [x] Optimización de requests de categorías
- [x] Revisión de imágenes/CLS y bundle

## F8 — Technical QA
- [x] Auditoría completa de código, arquitectura, configuración y documentación
- [x] Revisión runtime: rutas, filtros, requests/cancelación, galería, carrito y WhatsApp
- [x] Revisión de seguridad y accesibilidad; correcciones comprobadas
- [x] Responsive y teclado en navegador local sin configuración real
- [x] Pruebas de catálogo/carrito/WhatsApp, lint y build
- [x] Informe QA y checklist deployment (`docs/qa-report.md`)
- [ ] Smoke test de backend/hosting reales (posterior al deployment)
- [ ] Auditoría de vulnerabilidades concluyente (endpoint no disponible durante F8)

## F9 — Cajora product contract + commercial UX
- [x] Contrato stock/secondary image/rich content y schemas derivados
- [x] ProductCard con descripción, hover y acciones rápidas desde Home/Catálogo
- [x] Consulta individual por WhatsApp y composición del detalle
- [x] Product Detail con rich content semántico
- [x] Carrito v2 consciente de stock y checkout condicionado
- [x] Imagen de producto en carrito con fallback compartido
- [x] Reconciliación de snapshots sin requests extra ni recortes silenciosos
- [x] Tests, responsive con fixtures locales, lint y build
- [x] Documentación y validaciones F9 (`docs/f9-validation.md`)

## F10A — Definitive Cajora contract: slugs / routing / tri-state availability
- [x] Schemas de slugs compartidos, saleMode, availabilityStatus y availabilityNote
- [x] Detail API y ruta /productos/:slug, cancelación y 404 neutral
- [x] Filtro categoria con slug y categorySlug hacia API; navegación conserva filtros
- [x] Disponibilidad triestado y nota de detalle como texto
- [x] Consulta WhatsApp propia por los tres estados
- [x] Adaptador temporal de carrito v2; ON_ORDER excluido y enlaces por ID retirados
- [x] Límites públicos de rich content
- [x] Suites específicas, lint/build y QA responsive con fixtures
- [x] Documentación y evidencia docs/f10a-validation.md

## F10B — Cart contract migration
- [x] Snapshot/persistencia v3 con slug y availabilityStatus
- [x] Retiro de booleano legacy y adaptador temporal
- [x] Enlaces públicos de carrito restaurados por slug
- [x] Reconcile v3 con quantity preservada y unicidad defensiva
- [x] Revalidación concurrente al entrar/cambiar conjunto
- [x] Loading, error parcial/total y retry
- [x] Stale stock / out_of_stock / on_order sin recortes ni eliminaciones
- [x] Gate WhatsApp tras verificación y coherencia
- [x] Tests, lint/build y QA responsive con fixtures
- [x] Documentación docs/f10b-validation.md


## F11 — Storefront visual / merchandising UX
- [x] Announcement bar y Header neutral con contador de unidades desde app
- [x] Hero con negocio/logo, CTA y banners informativos; contenido centralizado
- [x] Categorías por slug, Cómo comprar y FAQ nativa
- [x] ProductCard con enlace informativo único, badge y secundaria on-demand
- [x] Breadcrumbs, panel comercial y galería vertical desktop/horizontal mobile
- [x] Rich content, búsqueda, filtros, carrito y Footer coherentes
- [x] Revalidación y gate WhatsApp F10B conservados y comprobados
- [x] Suites, lint/build, QA responsive y teclado con fixtures locales
- [x] Documentación y evidencia en docs/f11-validation.md


## F12 — VITRUNO Brand Integration
- [x] Inspección de los seis assets reales y preservación de originales
- [x] Tokens y paleta VITRUNO con contraste revisado
- [x] Manrope headings e Inter body/UI, swap y fallback
- [x] BrandLogo mínimo; Header/Footer y Home con identidad local canónica
- [x] Catálogo/cards/detail/gallery/cart mediante tokens de marca
- [x] Favicon ICO, manifest con medidas reales y metadata básica
- [x] Responsive 320/375/768/1024/1440, teclado y zoom CSS 200%
- [x] Suites catálogo/carrito/WhatsApp, lint y build
- [x] DEC-010, documentación vigente e informe docs/f12-validation.md


## F13 — VITRUNO visual redesign / editorial storefront
- [x] Inspección de siete nuevos PNG y preservación de originales
- [x] Reemplazo de paleta anterior y tokens Tech contemporánea
- [x] Logo propuesta 3, Header/Footer oscuros y variante mobile
- [x] Hero editorial con producto existente/fallback, sin requests extra
- [x] Categorías/productos prioritarios y un único bloque editorial
- [x] Catálogo/cards/detail/galería y carrito refinados sin cambios de dominio
- [x] OG 1200×630, manifest 192/512 y retiro de referencia ICO anterior
- [x] Responsive 320/375/768/1024/1440, contraste, teclado y touch emulado
- [x] Pruebas catálogo/carrito/WhatsApp, lint y build
- [x] DEC-011 y documentación docs/f13-validation.md


## F14 — Production UI Polish
- [x] HomeHero con status explícito y skeleton neutral estable
- [x] Selección visual prioriza imagen; producto sin imagen conserva enlace/fallback
- [x] Logo horizontal corregido 1200×630 integrado sin modificar el PNG
- [x] Header mobile centrado y escala desktop ajustada
- [x] Footer mobile centrado, desktop izquierda/derecha preservado
- [x] QA responsive y flujo detalle → Inicio con geometría estable
- [x] Suites catálogo/carrito/WhatsApp, lint y build
- [x] Documentación docs/f14-validation.md y estado vigente


## F15 — Commercial Copy / Purchase Handoff
- [x] FAQ de envíos a todo el país
- [x] FAQ de tiempos según localidad/medio de envío
- [x] FAQ de transferencias bancarias/billeteras virtuales/efectivo
- [x] Cómo comprar con Finalizá por WhatsApp
- [x] CTA de carrito Finalizar compra por WhatsApp en estados habilitado/deshabilitado
- [x] Microcopy de entrega, medio de pago y datos necesarios
- [x] Suites, lint y build; aviso de bundle documentado
- [x] QA de FAQ y estados del carrito en 320/375/768/1024/1440
- [x] Documentación docs/f15-validation.md

## F16 — Navigation + Side Cart + Contact / Guidance Pages
- [x] Side Cart modal con store v3 existente, edición y apertura exclusiva por clic en Carrito
- [x] Header con cantidad en mobile y cantidad/total en desktop y menú compacto accesible
- [x] Contacto con Zod y mensaje WhatsApp independiente, sin persistencia de datos personales
- [x] Rutas lazy /contacto, /como-comprar y /preguntas-frecuentes
- [x] Pasos/FAQ reutilizados en Home y páginas; navegación Header/Footer ampliada
- [x] 42 pruebas, lint/build y regresiones comerciales
- [x] QA de ocho rutas en 320/375/768/1024/1440; teclado, foco y estados de stock
- [x] Arquitectura, diseño, DEC-012 y docs/f16-validation.md actualizados

### Corrección visual F16
- [x] Retirar carril derecho, banda inferior y botón flotante
- [x] Restaurar ancho completo y scroll natural del documento
- [x] Ocultar total del Header bajo lg; conservar totales dentro del carrito
- [x] Eliminar apertura automática tras agregar productos

### Polish del acceso y transición
- [x] Cápsula de carrito con bolsa/contador, Mi pedido y total desde lg
- [x] Deslizamiento del panel 250 ms y fade del overlay 200 ms
- [x] Reduced motion, contenido estable durante cierre y foco accesible

## F17 — Add-to-Cart Feedback + StorePanels Preload
- [x] Preload de StorePanels tras montar el Storefront, conservando code splitting
- [x] Fallback visible “Abriendo panel…” eliminado
- [x] “En carrito: N” retirado de superficies de producto
- [x] Estado efímero “✓ Agregado” durante 1200 ms, solo ante incremento real
- [x] Toast central accesible con Base UI, 1500 ms y un único provider
- [x] Reduced motion, sin foco/interacción capturados por toast
- [x] QA de Home/catálogo/detalle en seis anchos; límite y rechazo sin falso feedback
- [x] 42 pruebas existentes, lint y build correctos
- [x] QA del preload en build de producción con fixtures
- [x] Documentación y rendimiento en docs/f17-validation.md

### Corrección de primera apertura del panel
- [x] Reproducir demora y ausencia de transición en el build local
- [x] Inicializar Dialog.Root cerrado desde el primer render; retirar lazy/preload/hasOpened del panel
- [x] Medir primera/segunda apertura antes y después en producción local y desarrollo
- [x] Validar seis anchos, Escape/foco, carrito y reduced motion
- [x] 42 pruebas, lint/build; impacto del bundle y limitaciones documentados

### Notificación inferior con react-hot-toast
- [x] Instalar react-hot-toast 2.6.1 y actualizar lockfile, por solicitud explícita
- [x] Sustituir toast de Base UI por un único Toaster compartido
- [x] Tarjeta inferior con check, título y nombre del producto
- [x] Confirmación exclusiva ante incremento real; sin autoapertura del panel
- [x] Safe area, ancho responsive y reduced motion
- [x] 42 pruebas, lint y build; documentación de la migración
- [x] QA de 18 casos en seis anchos, producto actualizado en una sola tarjeta, rechazo/stock y accesibilidad
