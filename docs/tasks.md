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
