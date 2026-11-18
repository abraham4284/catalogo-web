# Barra contextual y entrada a fichas — 2026-11-18

Implementado en dev sobre HEAD 7dc1c71, working tree inicialmente limpio.

## Implementación

CatalogQuickActions se monta desde HomePage y CatalogPage mediante QuickCatalogActions, que consulta el estado existente de paneles, consentimiento y toast. La barra se crea en un portal para salir del contenedor transformado por F18. Dos IntersectionObserver observan las referencias estables a controles superiores y productos. Se activa al pasar los controles con un margen de 24 px y cede al terminar el área de productos. Desconecta observadores al desmontar.

El diálogo modal compacto reutiliza Base UI, con backdrop, cierre explícito, Escape y retorno de foco. Buscar enfoca el campo únicamente tras la acción del usuario y reutiliza CatalogSearch con un ID propio. El formulario conserva submit, trim y máximo 150. Ambos controles construyen la URL mediante getCatalogHref, conservan el filtro cruzado y reinician página a uno. Los datos de categorías vienen de los hooks de la ruta. Los estados vacío o error presentan información y el acceso a Todas las categorías. El diálogo ajusta su altura y posición con visualViewport mientras está abierto.

FloatingWhatsAppContact aprovecha su único ciclo RAF y sus observadores para leer los rectángulos de los controles una sola vez, comprobar colisiones de la barra y de WhatsApp y aplicar el estado de visibilidad. El indicador efímero del diálogo abierto comunica prioridad a WhatsApp. Los atributos de colisión no forman parte de las mutaciones observadas, evitando ciclos de realimentación. Las barras ceden ante StorePanels, cookies y toasts.

useProductEntryScroll, coordinado con StoreRoute, ejecuta un frame de scroll instantáneo por pathname/key de navegación de ficha. El foco al main en fichas usa preventScroll. La restauración del navegador queda manual durante esa vista para impedir que una recarga profunda reaplique su coordenada al terminar de cargar datos o imágenes. Al salir se recupera auto, modo nativo vigente de la aplicación. Las interacciones del producto conservan el mismo pathname/key. Se limpia el frame pendiente al salir rápidamente.

ProductDetail mueve los breadcrumbs debajo de la galería dentro de una única columna izquierda. El panel comercial sigue a la derecha en escritorio y debajo en móvil. ProductDetailSkeleton reserva ese mismo orden. StoreLayout aplica a fichas un padding inicial compacto. Los archivos principales afectados son CatalogQuickActions, catalog-quick-visibility, QuickCatalogActions, FloatingWhatsAppContact, CatalogSearch, HomePage, CatalogPage, StoreRoute, useProductEntryScroll, StoreLayout, ProductDetail y ProductSkeletons.

## Validación automatizada

Desde client se ejecutaron node --test tests/*.test.cjs con 134 aprobadas, npm run lint y npm run build correctos. Se agregaron regresiones de visibilidad contextual y tres casos del ciclo de scroll, incluyendo cancelación de frames y navegación ajena a fichas. Se adaptaron los mocks de composición existentes.

## Smoke de navegador

Build preview y Edge headless con respuestas de API simuladas. Anchos 320, 375, 390, 540, 768, 1024 y 1440 px. Aparición tras los controles y ocultación al regresar arriba o llegar al footer. Se verificaron los dos objetivos táctiles, ausencia de desborde, foco inicial, retorno con Escape, categorías y URL desde Home y Catálogo, combinación search/categoria, Todas, limpieza y reinicio de página 2. Escribir y abrir/cerrar no agregaron solicitudes.

Se probaron superposiciones con WhatsApp, paneles, menú, carrito, toast y preferencias de cookies. El diálogo de búsqueda se comprobó con un viewport reducido a 375×360. Categorías vacías/error y productos vacíos conservaron estados útiles. Se revisaron reduced motion y zoom CSS al 200% en escritorio.

Desde Home y página 2 del Catálogo desplazados se abrieron fichas y se comprobó scrollY igual a cero. En la última ejecución, el retorno a Home recuperó 611 px y el retorno al Catálogo 751 px, sus coordenadas de salida. Se comprobó Adelante a ficha, cambio entre productos de la misma ruta lazy, cambio de imagen real, respuesta lenta y recarga profunda. La posición de la imagen principal coincidió con la del skeleton después de finalizar la transición de ruta. Miniaturas, compartir con cancelación simulada y agregar no produjeron un nuevo scroll instantáneo. También se abrió una ficha desde el side cart y se comprobó cero tras finalizar su cierre. La barra estuvo ausente de fichas, carrito, Contacto y FAQ.

Capturas de filtro y fichas a 375 y 1440 px inspeccionadas, además de capturas de barra cerrada. Se conservaron un H1, un breadcrumb y enlaces válidos. La disposición en paralelo se comprobó a 1440 px. Sin errores de página.

## Comparación de rendimiento local

Mismo build preview, viewport 375×667 y fixtures, sin limitación artificial de CPU/red en esta comparación. Las solicitudes iniciales antes y después fueron tres por ruta. Home pidió negocio, categorías y listado con limit 12. Catálogo pidió negocio, categorías y listado con limit 24. CLS observado antes y después de 0,003575 en Home y 0,024483 en Catálogo.

El bundle principal del build de prueba pasó de 313,63 kB / gzip 98,59 kB a aproximadamente 323,05 kB / gzip 101,22 kB. CSS de 50,91 / gzip 9,51 kB a 52,80 / gzip 9,83 kB. Se reutilizó la dependencia existente de Base UI. LCP e INP no se midieron en esta fase y estos datos no representan p75 de tráfico real.

## Evidencia y límites

Artefactos de la sesión en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/. Scripts quick-actions-measure.cjs y quick-actions-qa.cjs. Resultados quick-actions-before.json, quick-actions-after.json y quick-actions-qa.json. Capturas quick-bar-375.png, quick-bar-1440.png, quick-filter-375.png, quick-filter-1440.png, quick-detail-375.png y quick-detail-1440.png.

Pendientes el smoke desplegado en QA y la comprobación de Safari/Chrome móvil físico con teclado virtual, notch y safe areas reales. El teclado se aproximó mediante reducción del viewport. La prueba no abrió el share sheet ni envió mensajes.

Verificación adicional de fichas en el build final a 320, 375, 390, 1024 y 1440 px. Se comprobó imagen inmediatamente después del header, antes de breadcrumbs y datos en móvil, dos columnas en escritorio, scroll cero al entrar, alt y un único breadcrumb/H1. Evidencia en quick-product-sizes.cjs y quick-product-sizes.json.
