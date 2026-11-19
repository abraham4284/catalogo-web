# Breadcrumbs, activación temprana y glass — 2026-11-18

Implementación sobre dev con árbol inicialmente limpio. Sin operaciones Git de escritura, dependencias, cambios de API ni lógica comercial.

## Cambios acotados

- ProductDetail: un único ProductBreadcrumbs antes de ProductGallery en la columna de imagen. Un único h1. ProductBreadcrumbs conserva destinos; usa fila compacta de 44 px y truncado visual con nombre completo accesible y title. ProductDetailSkeleton reserva esa fila antes de la imagen.
- useCatalogQuickVisibility: obtiene la segunda fila por geometría de artículos reales dentro del primer ul de productos. No incluye categorías editoriales ni la tarjeta destacada exterior. No supone un índice según columnas. Durante scroll solo mide el top del elemento elegido; un listener pasivo agrupa eventos en un RAF. ResizeObserver y resize recalculan las filas cuando cambia el layout. Cleanup cancela frame y retira listeners/observer. No existe umbral si los artículos caben en una sola fila.
- catalog-quick-visibility: aparece cuando secondRowTop <= visibleViewportHeight × 0.65. Mismo límite al volver arriba. Reemplaza el límite anterior firstRowBottom <= -24 que esperaba la salida completa de la primera fila. Mantiene continuidad hasta footer y prioridades anteriores.
- CatalogQuickActions / QuickCatalogSearch: cuerpo background/90, borde claro, backdrop-blur-sm solo en la cápsula, brillo discreto con primary, ancho máximo 2xl y borde interior violeta de 2 px. Continúan entrada/salida 200/150 ms y reduced motion. No se altera CatalogSearch normal.

HomeProductFeed, HomePage, CatalogPage, WhatsApp y useProductEntryScroll no se modificaron. Tampoco stock, precios, carrito, persistencia, SEO, analytics, rich content o relacionados.

## Pruebas reales

138 pruebas pasan con node --test tests/*.test.cjs, npm run lint y npm run build desde client. git diff --check correcto.

Regresiones: selección de segunda fila en 1/2/3/4 columnas y redondeos, listas sin segunda fila, umbral al 65% en ambas direcciones, breadcrumbs únicos antes de galería, enlaces canónicos y skeleton. Test del hook simula 100 eventos de scroll: un RAF, sin recorrer de nuevo las tarjetas; comprueba redimensionamiento, lista de una fila y limpieza completa de listeners/frame/observer. Las tres regresiones de useProductEntryScroll siguen pasando.

Edge headless en preview aislado 5175 con fixtures de Cajora, sin tocar servidores existentes. No equivale a validar backend o QA desplegado.

- Matriz 320/375/390/540/768/1024/1440, Inicio y Catálogo. Oculta inicialmente y cuando segunda fila está 30 px antes del límite; visible 40 px después. En viewport de 800 px, segundo renglón medido a 479.5–480.25 px con barra visible, sin esperar salida completa de la primera fila. Respeta geometría de 1/2/3/4 columnas y categorías intercaladas.
- Continua visible bajando, subiendo y al llegar al footer; se oculta al regresar arriba. Sin overflow horizontal.
- Una sola fila (un producto o cuatro en desktop), vacío y error de productos: barra oculta.
- Siete anchos para ficha: breadcrumb encima de imagen, único breadcrumb y h1, scroll inicial cero. Capturas 375/1440 inspeccionadas.
- Cambio a otro slug con respuesta lenta: scroll cero y posición vertical de imagen final coincide con skeleton (<1 px). Cambiar imagen, compartir y agregar no añade reinicios de scroll.
- Buscador: foco inicial y retorno a Buscar en los 14 casos ruta/ancho, transición computada de 200 ms; reduced motion sin transición. Salida conserva DOM durante 150 ms con data-ending-style antes del desmontaje.
- Categoría real, quitar chip sin consulta ni pérdida de texto, cierre sin aplicar, búsqueda acotada/global, limpieza, Enter, Filtrar y page=1 comprobados.
- Cookies, toast, menú y side cart suspenden la barra; viewport 375×360 y zoom CSS 200% sin overflow. Sin errores JavaScript observados.
- Capturas de glass 375/1440 inspeccionadas: input delimitado aun sin depender del foco, acciones visibles y productos reconocibles detrás. En móvil el placeholder puede recortarse dentro del input según ancho; label completo y acciones permanecen accesibles.

## Comparación local antes/después

Builds comparables con API de fixture en 5175, WhatsApp de prueba y Pixel desactivado; sin modificar archivos de entorno. Build final restaurado con configuración normal del proyecto.

| Medición | Antes | Después |
| --- | --- | --- |
| JS principal | 327.72 kB / gzip 102.21 | 328.56 kB / gzip 102.43 |
| CSS | 54.27 kB / gzip 10.02 | 57.28 kB / gzip 10.35 |
| Solicitudes iniciales Inicio | 3 | 3 |
| Solicitudes iniciales Catálogo | 3 | 3 |
| CLS Inicio 375×667 | 0.002004 | 0.003575 |
| CLS Catálogo 375×667 | 0.024483 | 0.002004 |

Solicitudes iguales: categorías, negocio, productos (limit 12 Inicio / 24 Catálogo). Cero solicitudes al abrir, escribir o quitar chip. CLS corresponde a una corrida por ruta y versión; varía con fuentes/cargas asíncronas ya documentadas en la fase previa, por lo que no se interpreta como mejora/regresión demostrada ni p75. No se midieron LCP/INP de producción.

## Archivos modificados

Producción: CatalogQuickActions.tsx, QuickCatalogSearch.tsx, ProductDetail.tsx, ProductBreadcrumbs.tsx, ProductSkeletons.tsx, catalog-quick-visibility.ts y nuevo hooks/useCatalogQuickVisibility.ts, dentro de features/catalog.

Pruebas: catalog.test.cjs, wholesale-info.test.cjs y nuevo catalog-quick-visibility.test.cjs. Documentación: tasks.md, project-state.md, design.md y este informe.

## Pendientes

Smoke desplegado con Cajora QA y aprobación visual del propietario. Teclado virtual real Android/iOS, Safari físico, notch/safe areas y lector de pantalla quedan pendientes; emulación de viewport no los sustituye. No se realizaron promociones Git; flujo manual dev → qa → master.
