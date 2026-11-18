# Home orientada a productos — UX y rendimiento — 2026-11-18

Implementado en dev sobre HEAD 19534d5230f684dab62a7b46842b124c9c3a976c, árbol inicialmente limpio.

## Composición

HomeProductFeed usa ProductCard y ProductCommerceActions en una única lista. Intercala HomeCategories después de 2 artículos bajo 540 px, 4 entre 540 y 767, 6 entre 768 y 1279 y 8 desde 1280. Con 12 productos, quedan respectivamente 10, 8, 6 y 4 después de categorías. Se conserva el orden de respuesta y se deduplican identificadores y slugs. Con pocos artículos, las categorías aparecen tras el último y queda disponible el enlace al catálogo.

La suscripción de useSyncExternalStore observa únicamente tres media queries de columnas. La primera lectura usa el viewport actual. Los listeners se limpian al desmontar. Al cambiar el breakpoint, se mueve el elemento de categorías en la lista y se conservan las claves de cada artículo. El smoke confirmó identidad de los nodos de la primera card y su botón a través de cinco anchos, con la misma cantidad de solicitudes. El orden DOM sigue el orden visual.

El producto elegido por merchandising usa su card de la grilla si su slug ya está incluido. Cuando el candidato queda fuera de la respuesta, aparece en su tarjeta compacta después de la lista. El banner de apertura y la información institucional siguen a los productos. En móvil, el hero integra la fotografía en el área superior derecha y la descripción tiene fondo local para legibilidad. Cómo comprar y FAQ mantienen la información completa. La franja resumida de pasos y servicios del hero se muestra desde lg.

## Decisión de carga

Se aumentó el limit de la consulta existente de 8 a 12. Tres GET por tamaño sobre Cajora local entregaron 8 y 12 artículos respectivamente. Respuestas de 4.824 y 6.972 bytes. Tiempos de 326/117/116 ms para 8 y 115/116/115 ms para 12. La primera petición incluye el establecimiento de conexión. La diferencia de payload fue de 2.148 bytes y las muestras posteriores a la primera conexión fueron comparables.

El build de QA conserva tres solicitudes iniciales de API por navegación, negocio, categorías y listado. Cuando el producto intencional ya está en la respuesta, se observaron cero solicitudes de detalle para seleccionarlo. Se mantiene la recuperación existente de candidato cuando hace falta.

## Comparación local antes y después

Edge headless, mismo equipo, build preview, viewport fijo, CPU limitada a 4x, latencia 100 ms, descarga 1,6 Mbps y subida 750 Kbps mediante CDP. Fuentes externas bloqueadas de forma consistente. Respuestas de catálogo simuladas con 150 ms de demora, 8 artículos antes y 12 después. Las fotos de producto de las fixtures reutilizan tres WebP locales. Se esperó la carga de recursos y la decodificación del hero antes de registrar el resultado. Se vació la caché para la entrada fría y se recargó con caché para la caliente. Son muestras locales individuales por combinación.

| Viewport / caché | Primer producto Y antes → después | LCP antes → después | CLS antes → después |
| --- | --- | --- | --- |
| 375×667 / fría | 2243 → 451 px | 7580 → 7780 ms | 0 → 0 |
| 375×667 / caliente | 2243 → 451 px | 972 → 1040 ms | 0 → 0 |
| 390×844 / fría | 2227 → 451 px | 7584 → 7692 ms | 0 → 0 |
| 390×844 / caliente | 2227 → 451 px | 892 → 1040 ms | 0 → 0 |

El header móvil pasó de 132 a 56 px. El bloque completo del hero pasó de 769/749 a 252 px. La primera foto se ve en el viewport inicial de ambos tamaños.

La cantidad total de recursos registrados fue de 19 a 17 en frío y de 20 a 18 en caliente. Los archivos WebP solicitados al entrar pasaron de cinco a tres, incluyendo el umbral de carga diferida del navegador. Transferencia fría de esos recursos de 1.408.526 a 953.312 bytes. Las fixtures del listado ocuparon 3.588 y 5.324 bytes. La carga completa observada pasó de aproximadamente 10,9 s a 8,6–8,8 s en frío. El LCP mostró un aumento de 108–200 ms en frío y 68–148 ms en caliente en estas muestras. La mejora principal es la posición y la menor transferencia inicial de imágenes. INP y Core Web Vitals p75 de tráfico real quedan fuera de esta medición.

El bundle principal de QA pasó de 311,19 a 313,63 kB, gzip de 97,93 a 98,59 kB. Se conservaron las imágenes originales. Hero con prioridad alta, categorías y banner con carga diferida.

## Validaciones

Desde client, node --test tests/*.test.cjs, 130 aprobadas. npm run lint y npm run build correctos. Se añadieron tres regresiones en wholesale-info.test.cjs para composición única, pocos artículos/loading y selección del producto sin repetición. Se actualizó la fixture antigua del fallback tecnológico para reflejar Auriculares, valor ya vigente en el contenido al iniciar esta tarea.

Smoke en build preview con Edge en 320, 375, 390, 540, 768, 1024, 1280 y 1440 px. Se verificaron cantidad de artículos antes y después de categorías, 12 cards únicas, un H1, ausencia de enlaces anidados, controles táctiles de al menos 44 px, orientación 844×390 y zoom CSS al 200%. Se comprobó foco visible, ancla Cómo comprar, menú móvil, side cart, agregado y enlace habilitado de checkout, validación de Contacto, ficha con botón Compartir, FAQ mayorista por hash, canonical y reduced motion.

Se probaron respuesta lenta, primer skeleton en la misma posición que la card cargada después de completar la transición de ruta, pocos productos, categorías ausentes, catálogo vacío, error/reintento, candidato externo al listado y fallos de imágenes. Los enlaces de categorías operaron aun con imágenes fallidas. No hubo errores de página. Capturas de primer pantallazo antes/después y de QA a 375 y 1440 inspeccionadas visualmente.

## Evidencia y pendientes

Directorio de la sesión en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/. Scripts products-first-measure.cjs y products-first-qa.cjs. Resultados products-first-before.json, products-first-after.json y products-first-qa.json. Capturas products-first-before-375-cold.png, products-first-after-375-cold.png y equivalentes a 390, además de products-first-qa-375.png y products-first-qa-1440.png.

Antes de promover a QA, corresponde la revisión visual del propietario y el smoke sobre categorías, inventario e imágenes de ese entorno. El benchmark mide fixtures locales. Quedan pendientes mediciones de tráfico real y dispositivos físicos.
