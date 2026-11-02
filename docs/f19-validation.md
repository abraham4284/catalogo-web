# F19 — SEO Foundation + Google Indexing

Fecha: 2026-11-02. Rama dev, limpia al iniciar. Implementación técnica local; no se publicó ni se validó el dominio real.

## Implemented
- robots.txt y sitemap.xml públicos, copiados a dist por Vite.
- Canonical, title, description, robots, Open Graph y Twitter por ruta.
- Ficha con metadata real, estado genérico durante carga y noindex ante error/404.
- Product/Offer JSON-LD seguro, sin datos comerciales inventados.
- Sin dependencia SEO, SSR/SSG, Meta Pixel, skeletons nuevos ni cambios API/cart/checkout.

## Robots
`client/public/robots.txt`: User-agent *, Allow / y Sitemap https://vitruno.com.ar/sitemap.xml. No bloquea JS/CSS/imágenes ni el carrito; la exclusión de índices del carrito se hace con meta robots, permitiendo al robot leerla.

## Sitemap
XML con namespace sitemaps.org, cinco URLs absolutas:
- https://vitruno.com.ar/
- https://vitruno.com.ar/productos
- https://vitruno.com.ar/como-comprar
- https://vitruno.com.ar/preguntas-frecuentes
- https://vitruno.com.ar/contacto

Sin carrito, 404, queries, localhost, Render ni lastmod/priority/changefreq inventados. Se validó con DOMParser XML (sin parsererror) y en servidor de preview con HTTP 200/MIME no HTML.

Productos pendientes del sitemap: el repo solo dispone de listado paginado de API en runtime; no hay dataset versionado ni updatedAt público confiable. Se eligió la alternativa estática inicial permitida, evitando fetch remoto al build y slugs de fixtures. Un generador posterior debería recorrer la fuente pública estable y conservar las fichas válidas agotadas/por encargo. Mientras tanto, las fichas reales son descubribles desde links del catálogo una vez renderizado.

## Metadata
Composición RouteSeo por IDs de rutas, sin cambiar paths ni lazy loading. Rutas públicas tienen título/descripción propios; Home conserva el copy aprobado y no inventa categorías ni nuevas condiciones de entrega. La ficha usa nombre real, descripción normalizada (meta máximo 180 caracteres), fallback neutral y slug publicado sin slugify.

Un único propietario activo: RouteSeo para rutas estáticas o el detalle con su hook ya existente. No se agregan requests de SEO. El componente Seo comparte helpers DOM que actualizan/reutilizan tags del HTML inicial y eliminan duplicados; no combina tags React 19 hoisted con fallback estático duplicado ni instala Helmet. Cada cambio escribe todos los campos y borra Product JSON-LD si no corresponde. Historial y navegación sin reload comprobados.

Cargando ficha: Producto | VITRUNO, index,follow y sin JSON-LD previo. Éxito: nombre | VITRUNO e index,follow. Error/404/slug inválido: Producto no disponible | VITRUNO, noindex,follow y sin Product JSON-LD. Invalid slug no inicia fetching. Un error transitorio no se presenta como información de otro producto.

## Canonical
Host fijo https://vitruno.com.ar, sin www ni onrender. Home termina en /; otras rutas no añaden slash final. Catálogo canonicaliza siempre a /productos, ignorando search/page/categoria. Producto usa el slug real retornado. Páginas no indexables llevan canonical local propio y no se incluyen en sitemap. Helpers rechazan URLs externas/protocol-relative como pathname.

OG/Twitter usan título/descripción/canonical actual. og:type website o product. Imagen de producto HTTP(S) real (portada o galería válida) y fallback https://vitruno.com.ar/og-image.png. Se filtran javascript/data/credenciales. URLs relativas se resuelven respecto del canonical de ficha; rutas de asset con / se resuelven al host canónico. Imagen de marca comprobada en PNG: 1200×630. Esas dimensiones se omiten cuando la imagen real no tiene medidas públicas conocidas.

## Product structured data
Product con nombre/descripción reales y array de imágenes válidas sin duplicación; sin imagen se omite ese campo en JSON-LD (OG mantiene fallback de marca). Offer solo con precio finito no negativo, priceCurrency ARS, precio numérico sin formato local y URL canonical. Precio 0 se conserva como dato real; valores negativos/no finitos no generan Offer.

Availability usa el estado comercial, sin inferirlo del stock físico:
- in_stock → https://schema.org/InStock
- out_of_stock → https://schema.org/OutOfStock
- on_order → availability omitida; la ficha sigue indexable.

Se consultaron [BackOrder](https://schema.org/BackOrder) y [PreOrder](https://schema.org/PreOrder). Ninguno se afirma para encargos que solo permiten consultar condiciones: no hay contrato público que confirme reposición aceptada ni lanzamiento en preventa. Se opta por no inventar esa información; la política de encargos queda para otra fase. Las condiciones y campos para resultados de producto están en [Google Product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet); el marcado no garantiza resultados enriquecidos.

No se incluyen SKU, GTIN, marca del fabricante, ratings, reviews, shippingDetails o returnPolicy porque no existen datos públicos confiables. Tampoco Organization/LocalBusiness/BreadcrumbList. Script application/ld+json con textContent y JSON serializado escapando < y separadores Unicode: datos que contienen </script> no pueden insertar etiquetas/HTML.

## Index strategy
Indexables: Home, catálogo base, fichas públicas existentes (incluidas agotadas/encargo), cómo comprar, FAQ y contacto. Noindex,follow: carrito, rutas desconocidas y fichas con error/404. Query params no crean canonicals distintos. Noindex no se sustituye por Disallow en robots.

## Automated validation
Desde client:
- node --test tests/*.test.cjs: 54 pasan, 0 fallos (17 catálogo, 16 carrito, 9 WhatsApp, 3 loader, 9 SEO).
- Nuevas pruebas de canonical, texto/Unicode, imágenes, Product/Offer sin mutación, disponibilidad, fallbacks/precios inválidos, serialización segura, metadata de estados y sitemap/robots.
- npm run lint: OK.
- npm run build: OK, con aviso existente de principal >500 kB.
- git diff --check: sin errores de whitespace, avisos de normalización LF/CRLF en Windows.

## Browser / responsive validation
Edge headless con fixtures locales. 55 casos = once URLs × 320/375/768/1024/1440: Home, catálogo, catálogo con filtros, ayuda, FAQ, contacto, carrito, 404 y tres estados de producto. Metadata esperada, canonical/robots/OG/Twitter correctos, sin tags duplicados ni overflow. Las fichas usan su imagen/precio/nombre reales; dimensiones genéricas retiradas al usar fotos reales.

Navegación SPA Home → Producto A → catálogo → Producto B → catálogo → FAQ → contacto, Back/Forward y cambio directo entre fichas mediante historial real. Marcador de documento confirma que no hubo reload. Con respuesta lenta se comprobó título genérico y retirada de JSON-LD del producto anterior antes del éxito. También errores 503, 404 y slug inválido sin fetching. Regresión: galería, agregado/toast sin autoapertura, Side Cart → carrito completo → WhatsApp habilitado tras revalidación, menú mobile y route-enter conservados. Sin errores JavaScript en el recorrido final.

Build local con configuración temporal de fixtures: HTML fuente sin dominio Render, robots/sitemap servidos como archivos correctos, metadata/JSON-LD en los tres estados y noindex del carrito sin datos de producto residuales. No se editaron archivos de entorno; luego se recompiló con configuración normal. Un timeout aislado del primer recorrido completo no se reprodujo al repetirlo; se conserva únicamente la evidencia de la ejecución final completa.

## Performance
Tamaños Vite (kB decimales, configuración normal):

| Asset | F18 min / gzip | F19 min / gzip |
| --- | ---: | ---: |
| Principal | 572.42 / 181.06 | 576.07 / 182.49 |
| jsx-runtime inicial | 8.90 / 3.38 | 8.90 / 3.38 |
| JS inicial total | 581.32 / 184.44 | 584.97 / 185.87 |
| ProductDetailPage | 0.74 / 0.42 | 2.13 / 1.00 |
| CSS | 42.27 / 8.09 | 42.27 / 8.09 |
| HTML inicial | 1.81 / 0.74 | 2.40 / 0.81 |

Inicial JS +3.65 kB min / +1.43 gzip; detalle +1.39 / +0.58; CSS sin cambio. El resto de chunks de páginas y recuperación F18 mantienen tamaños aproximados anteriores. Sin nuevas dependencias, manualChunks ni cambios para ocultar el aviso >500 kB. No se midieron Core Web Vitals.

## Production checklist — manual después del deploy
Search Console verificado por DNS TXT según el usuario/documento de tarea; no se modificó ni se verificó independientemente ese registro.

- [ ] Publicar el build con configuración API/WhatsApp real y fallback SPA apropiado.
- [ ] Verificar HTTPS y host preferido vitruno.com.ar; revisar redirecciones desde www/Render si corresponden al hosting.
- [ ] Confirmar respuestas reales de /, /robots.txt, /sitemap.xml, /productos y /productos/<slug-real>, así como acceso público a JS/CSS/imágenes.
- [ ] Comprobar canonicals/render de fichas y noindex carrito/404; revisar headers HTTP/X-Robots-Tag del hosting que pudieran contradecirlos.
- [ ] Ejecutar Rich Results Test con una ficha real y revisar errores/avisos sin inventar datos para eliminarlos.
- [ ] Search Console → Sitemaps → enviar sitemap.xml manualmente.
- [ ] URL Inspection → probar URL publicada/renderizada → solicitar indexación de Home/catálogo/ficha real manualmente.
- [ ] Monitorear rastreo/indexación y resolver señales reales, sin asumir indexación inmediata ni garantizada.

## Known limitations
La SPA sigue necesitando render JS para metadata de rutas, noindex y JSON-LD dinámico. El HTML fuente de rutas profundas conserva el fallback de Home; crawlers/previews que no ejecutan JS pueden mostrar esa metadata. Google documenta las fases de [rastreo, renderizado e indexación de JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). No se implementó SSR/SSG/prerender ni una respuesta HTTP 404 de servidor: las rutas inexistentes son noindex del lado cliente y el estado HTTP depende del hosting (posible soft 404).

Sitemap inicial sin productos; no hay lastmod público confiable. QA en backend/hosting real, Rich Results Test, Search Console, Safari/dispositivos físicos y lector de pantalla pendientes. No se afirmó producción validada ni se enviaron solicitudes de indexación. Las imágenes/precios públicos deben seguir siendo accesibles/coherentes en producción. El marcado Product no asegura elegibilidad en todas las superficies de Google ni indexación.

## Evidence
Directorio C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- f19-qa.cjs y f19-qa-results.json: 55 casos, SPA/historial, estados, XML y regresión.
- f19-direct-qa.cjs: cambio directo entre fichas por historial real, limpieza durante loading.
- f19-production-qa.cjs: smoke del build local y archivos públicos.

Sin bloqueos de implementación. Pendientes externos explícitos: despliegue/verificación real, envío manual e inspección Search Console y fuente estable para sitemap de productos.
