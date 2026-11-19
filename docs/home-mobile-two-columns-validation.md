# Home: ocho productos y dos columnas móviles — 2026-11-19

Rama dev, árbol inicialmente limpio. Sin operaciones Git de escritura, dependencias nuevas ni cambios en Cajora, API, lógica comercial, SEO o analytics. Promoción manual pendiente dev → qa → master.

## Implementación

HomeProductFeed conserva una sola lista y las claves por identidad; deduplica IDs/slugs. Usa Math.min(8, items.length), con categorías reales después del octavo y cuatro artículos posteriores si la respuesta trae doce. Se eliminó useSyncExternalStore y sus tres suscripciones a matchMedia. Sin categorías, no hay li de relleno; con cero artículos y categorías reales se conserva la semántica anterior de navegación por categorías, sin cards falsas. Loading contiene doce skeletons y el bloque de categorías después del octavo.

HomeProductFeed, ProductGrid y ProductGridSkeleton: dos columnas móviles, tres en md y cuatro en xl. Gap horizontal móvil de 12 px. Cards con nombre de dos líneas, precio principal de 18 px en móvil y 24 px desde sm, secundario conservado. Importes extensos pueden envolver sin alterar valores. Los dos CTAs mantienen texto, enlaces y lógica: presentación compacta desde ProductCard con alto mínimo de 56 px en móvil / 44 px desde sm. Disponibilidad y badges se mantienen dentro de la card, también al ampliar. Imagen cuadrada/object-contain y lazy; hover mouse/pen y touch sin cambios.

La variante detail de precios y su skeleton no cambian. No se modificaron useCatalogHome (limit 12), paginación (24), stock, cálculo mayorista, carrito, checkout, glass, chip, breadcrumbs o useProductEntryScroll. La segunda fila se sigue detectando mediante geometría existente.

## Validaciones ejecutadas

Desde client: node --test tests/*.test.cjs: 140 pasan; npm run lint y npm run build correctos. git diff --check sin errores (Git avisa de normalización de finales de línea en index.html, sin diff de contenido de ese archivo).

Se adaptó la regresión existente de orden/deduplicación a ocho antes y cuatro después. Se agregaron dos casos: tres/vacío/sin categorías, y loading de doce con corte después de ocho y dos columnas. Los tests comerciales existentes siguen pasando.

Edge headless sobre build preview aislado 5175 con fixtures de Cajora; no se alteraron servidores existentes. Matriz Inicio y Catálogo:

| Ancho | Columnas |
| --- | --- |
| 320 / 375 / 390 / 430 / 540 | 2 |
| 768 / 1024 | 3 |
| 1280 / 1440 | 4 |

En los 18 casos se comprobaron cantidad de columnas, ausencia de overflow horizontal, controles de card dentro de sus límites y blancos táctiles de al menos 44×44. Inicio: doce artículos únicos en orden exacto ocho/categorías/cuatro. Catálogo: 24 productos.

Casos adicionales:

- Loading 320/375/390: dos columnas, doce skeletons, categoría en posición ocho. Tres productos antes de categorías; vacío y error sin cards falsas; categorías vacías sin bloque ficticio.
- Importes 123.456.789,99 minorista / 111.111.111,99 mayorista, nombre extenso, falta de imagen, sin mayorista, disponible/agotado/encargo y badges, en seis anchos sin overflow. Captura inspeccionada en 320.
- Fotos principales con loading=lazy; secundaria no se monta al evento touch y sí al evento mouse. No se forzó la descarga de todas las fotos.
- Barra al alcanzar segunda fila y continua al bajar/subir; vuelta arriba la oculta. Redimensionar 375→768→375 no genera consultas.
- Agregar muestra toast y suspende la barra. Cookies, menú y side cart mantienen prioridad; ventana pequeña y salida animada del glass operativas.
- Buscar conserva trim y submit explícito sin consultas al escribir. Filtrar preserva search; Siguiente preserva search/categoria y page=2, con 24 productos, barra funcional y Back correcto.
- Entrada a ficha conserva scroll cero y breadcrumbs encima de la imagen. No se tocaron sus componentes ni hook.
- Zoom CSS 200% en 375: se detectó y corrigió desborde de disponibilidad; después scrollWidth=375. Cards y controles permanecen dentro de sus límites; foco por Tab operativo. Esta emulación no sustituye zoom/teclado/lector de pantalla físicos.

Capturas inspeccionadas en el directorio de artefactos de la sesión:
C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/

- two-columns-home-320.png, two-columns-home-375.png, two-columns-home-1440.png
- two-columns-catalog-320.png, two-columns-catalog-375.png, two-columns-catalog-1440.png
- two-columns-edge-320.png, two-columns-zoom.png
- Registro two-columns-qa.json y mediciones two-columns-before.json / two-columns-after.json.

## Rendimiento local

Builds comparables con API de fixture en 5175, WhatsApp de prueba y Pixel desactivado; sin cambiar archivos de entorno. Build final correcto con la configuración normal del proyecto.

| Bundle | Antes | Después final |
| --- | --- | --- |
| JS principal | 328.56 kB / gzip 102.43 | 328.14 kB / gzip 102.29 |
| Chunk ProductCommerceActions | 113.83 kB / gzip 37.93 | 114.34 kB / gzip 38.10 |
| CSS | 57.28 kB / gzip 10.35 | 59.22 kB / gzip 10.56 |

Mismos 486 módulos. Los dos chunks JS indicados suman +0.09 kB (+0.03 gzip); CSS +1.94 kB (+0.21 gzip). No se agregan suscripciones ni listeners; se eliminan los de columnas de Home.

Tres solicitudes iniciales por página antes y después: categorías, negocio, productos (limit 12 Home / 24 Catálogo). Sin consultas al cambiar ancho, abrir buscador o escribir.

PerformanceObserver, viewport 375×667, una muestra por ruta/configuración:

| Escenario | CLS antes → después | LCP laboratorio antes → después |
| --- | --- | --- |
| Home normal | 0.003575 → 0.003577 | 480 → 548 ms |
| Catálogo normal | 0.002004 → 0.002004 | 196 → 212 ms |
| Home con latencia | 0.002620 → 0.002620 | 1048 → 644 ms |
| Catálogo con latencia | 0.189864 → 0.189864 | 528 → 536 ms |

Latencia simulada: espera de 350 ms en fixture API y 500 ms antes de continuar imágenes. No es una emulación completa de red móvil (sin límite de ancho de banda/CPU). Una corrida es orientativa y sensible a cachés/fuentes; no demuestra mejora o regresión de LCP ni cumplimiento de p75. CLS 0.19 de Catálogo con latencia ya existe en baseline, excede la referencia 0.1 y sigue pendiente de diagnóstico separado. No hay RUM ni medición INP/producción. Las últimas correcciones de wrapping/badges y aislamiento de estilos de detalle se comprobaron por QA responsive final; las mediciones PerformanceObserver corresponden al build previo a esas correcciones menores.

## Archivos modificados

- client/src/pages/home/components/HomeProductFeed.tsx
- client/src/features/catalog/components/ProductGrid.tsx
- client/src/features/catalog/components/ProductSkeletons.tsx
- client/src/features/catalog/components/ProductCard.tsx
- client/src/features/catalog/components/ProductCardImage.tsx
- client/src/features/catalog/components/ProductPrices.tsx
- client/tests/wholesale-info.test.cjs
- docs/tasks.md, docs/project-state.md, docs/design.md y este informe.

## Pendientes

Smoke desplegado con Cajora QA y aprobación visual del propietario. Probar dispositivos Android/iOS reales, teclado, lector de pantalla y notch/safe areas. Revisar CLS preexistente del catálogo bajo carga lenta. No se promovió a qa/master ni se actualizó producción.
