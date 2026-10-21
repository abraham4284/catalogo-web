# Validación F13 — VITRUNO visual redesign / editorial storefront

Fecha: 2026-10-21. Rama dev. Rediseño sobre F12, con nueva identidad aprobada y contratos comerciales conservados.

## Assets

Estado inicial: el usuario ya había reemplazado seis PNG, eliminado favicon.ico y agregado og-image.png. Se inspeccionaron realmente los siete PNG actuales; no se restauró ningún asset anterior. Formato PNG RGBA, fondos oscuros opacos/prácticamente opacos, sin maestro SVG disponible.

| Archivo | Dimensiones | Bytes | Alpha |
| --- | --- | ---: | --- |
| vitruno-logo-horizontal.png | 1600×560 | 113832 | 255 |
| vitruno-isotipo-512.png | 512×512 | 87667 | 255 |
| favicon-64x64.png | 64×64 | 4539 | 254–255 |
| apple-touch-icon.png | 180×180 | 17508 | 254–255 |
| icon-192.png | 192×192 | 19401 | 254–255 |
| icon-512.png | 512×512 | 87667 | 255 |
| og-image.png | 1200×630 | 83381 | 255 |

Logo propuesta 3: V en degradado violeta/lavanda/intermedios, wordmark blanco y fondo #242038. Se conservan márgenes y raster original, sin filtros CSS, recortes ni deformación. Desktop horizontal en caja 320/384 px; Footer horizontal limitado al ancho disponible. Header mobile usa isotipo en caja 64 px porque el lettering del horizontal resulta pequeño al reducir todo el PNG. Nombre accesible VITRUNO conservado; variante oculta no duplica el nombre en el árbol accesible.

Los SHA-256 de los siete originales antes/después coinciden; assets de dist son copias exactas. No se generaron nuevas variantes ni se descargaron fotografías. Favicon revisado a 16/32/64 sobre fondos claro/oscuro en lámina local: monograma reconocible con pérdida de detalle esperable a 16. No se inspeccionó el chrome real de pestañas. ICO antiguo no se regenera: estrategia PNG, referencia retirada y ausencia en dist confirmada.

## Visual identity

DEC-011 sustituye la paleta anterior, conservada solo en documentos históricos/DEC-010. Tokens vigentes: background #FAFAFC, foreground #242038, primary #6547BE con blanco, accent/secondary #EAE6F7 y card blanco. Muted/border/input derivados, muted-foreground #625E72. Sin tokens nuevos para cada matiz del degradado.

Header/Footer oscuros compatibles con el asset; página clara. Foco claro sobre shell oscuro y violeta sobre superficies claras. No dark mode global. Manrope headings e Inter UI/body se mantienen con sus links únicos, preconnect, display=swap y fallback; no nueva fuente ni dependencia.

Cards pierden el borde exterior de panel y mantienen un solo enlace informativo, acciones hermanas y fotografía protagonista. Badges siguen mostrando Disponible/No disponible/Por encargo en violeta/lavanda/neutral. Detalle sin caja comercial envolvente, galería sin cambios de behavior y carrito con filas abiertas/resumen discreto. No se ocultaron loading/error/stale/retry.

## Home/editorial

Referencia [Bellroy](https://bellroy.com/) consultada para alternancia de visuales amplios, productos y bloques narrativos. Se interpreta ese ritmo con composición propia, sin copiar branding, fotografías, textos, promociones o mega-menu.

Orden comprobado en DOM: Hero → Categorías → Productos → bloque editorial → Cómo comprar → FAQ. Se retiraron los dos banners repetitivos anteriores y su componente sin uso. Un único HomeEditorial expresa selección con criterio/stock y encargo desde storefront-content.ts.

Hero sin card gigante, titular con mayor jerarquía y CTA violeta. En desktop muestra portada/nombre/enlace del primer producto ya cargado; no afirma featured, novedad o bestseller. No filtra el listado ni consulta detalle. Sin imagen, ante error/loading o Home vacía, usa isotipo decorativo. En mobile se oculta el visual lateral para acercar categorías/productos al inicio.

Prueba de requests al entrar a Home: solo catalog, categories y products (duplicados/cancelados por StrictMode en dev); cero endpoints /products/:slug para Hero. Se comprobaron loading/error/vacía y primer producto sin imagen, conservando h1/guía/FAQ y fallback.

## Metadata

- Title VITRUNO | Buenas elecciones, todos los días.; descriptions coherentes y sin claims nuevos.
- theme-color #242038, OG title/description/type existentes conservados.
- og:image https://vitruno.onrender.com/og-image.png, width 1200, height 630 y alt descriptivo; sin tags duplicados ni otra URL inventada.
- Manifest browser con background #FAFAFC y theme #242038; iconos 192/512 declarados con sus dimensiones reales. Apple touch sigue en 180.
- Referencia ICO anterior retirada. PNG favicon actual activo; sin service worker, offline cache ni instalación PWA.
- Build final contiene OG, manifest, favicon, apple touch e iconos. Tamaños de manifest comparados con PNG reales; JSON válido. Rutas estáticas verificadas 200 en servidor local.

No se afirma actualización del deployment, cachés o previews externas.

## Automated

Desde client:

```text
node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs
39 passed, 0 failed: catálogo 17 / carrito 16 / WhatsApp 6
npm run lint: OK
npm run build: OK, sin warnings
git diff --check: OK
```

Sin dependencias nuevas ni framework DOM. Playwright/Pillow del runtime local para QA e inspección fuera del proyecto. Se conservaron API, schemas, slugs, routing, hooks, revalidación, store/cart v3, stock y mensajes WhatsApp; cambios de features limitados a presentación.

## Responsive

Edge headless con contexto aislado; Vite 127.0.0.1:5175 y fixture HTTP 127.0.0.1:5176. No se alteraron .env, backend ni sesión del usuario. Console Ninja requirió acceso local fuera del sandbox para arrancar el servidor; configuración del proyecto intacta.

| Ruta | 320 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| / | OK | OK | OK | OK | OK |
| /productos | OK | OK | OK | OK | OK |
| /productos?categoria=objetos-diarios | OK | OK | OK | OK | OK |
| /productos/producto-disponible | OK | OK | OK | OK | OK |
| /carrito vacío | OK | OK | OK | OK | OK |
| /404 | OK | OK | OK | OK | OK |
| /carrito con 10 unidades | OK | OK | OK | OK | OK |

OK: sin overflow de página. Primeras seis rutas: 30 combinaciones con un h1, cero controles interactivos anidados y logos visibles cargados, sin deformación. Se revisaron capturas de Home desktop/mobile; también se generaron detalle/carrito en 375/1440, carrito con items/error y Home vacía. PNG de producto en capturas son fixtures neutros, no fotos de producción.

Interacciones: búsqueda, categoría activa por slug, página 2 conservando categoría, galería por Enter/aria-pressed, agregado, contador 10, FAQ por Enter, ancla, skip link y foco al navegar. Disponible/agotado/encargo visibles. Carrito bloquea durante loading/error/stale/agotado/encargo; retry exitoso habilita consulta. Enlace WhatsApp no abierto ni mensaje enviado. Ningún pageerror.

Touch emulado 375: secundaria ausente inicialmente, tap abre detalle por slug. Hover mouse monta secundaria; reduced-motion medido 0s. Fuentes Inter 400/500/600 y Manrope 600 cargadas en contenido usado. Fallback con hosts de fonts bloqueados y zoom CSS 200% a 320 sin overflow; no equivale a dispositivo físico ni zoom nativo.

## Accessibility

Se mantienen nombre accesible VITRUNO, alt de producto, imágenes decorativas sin anuncio, labels, breadcrumbs, semántica rich content y estados textuales. No color-only. Focus en input: outline solid 2 px rgb(101,71,190); link de logo en shell: outline 2 px rgb(250,250,252). Scope local de ring claro permite conservar contraste en Header/Footer oscuros.

Luminancia relativa sRGB calculada:

| Par | Ratio |
| --- | ---: |
| Primary #6547BE / blanco | 6.57:1 |
| Primary / background #FAFAFC | 6.30:1 |
| Foreground #242038 / lavanda | 12.82:1 |
| Muted foreground #625E72 / lavanda | 5.10:1 |
| Background claro / shell oscuro | 15.05:1 |

Primary sobre shell oscuro da 2.39:1: no se usa como texto ni como foco sobre ese fondo. Navegación clara y ring claro; badge del carrito usa blanco sobre primary. Sin auditoría WCAG completa ni lector de pantalla real.

## Performance

| Asset | F12 min/gzip | F13 min/gzip |
| --- | --- | --- |
| JS principal | 498.78 / 155.40 kB | 499.46 / 155.62 kB |
| ProductDetailPage | 0.70 / 0.39 kB | 0.70 / 0.39 kB |
| CatalogPage | 1.47 / 0.72 kB | 1.47 / 0.72 kB |
| CSS | 36.09 / 6.96 kB | 36.22 / 7.10 kB |

Principal +0.68 kB y CSS +0.13 kB; sin nuevos paquetes ni bibliotecas de motion/carousel. El principal sigue muy cerca de 500 kB: vigilar próximas fases. Logo nuevo 113832 bytes frente a 323909 anterior; imágenes originales no se recomprimen. Hero reutiliza URL del listado y no añade requests de API. Sin Lighthouse ni Core Web Vitals de producción.

## Known limitations

Assets raster opacos, con márgenes/composición originales; no vector editable. Variante mobile con isotipo es una decisión de legibilidad. Visual lateral del Hero solo desde md. Caché/preview de navegador y plataformas sociales no comprobadas tras deployment.

Persisten pendientes operativos previos: smoke Cajora/hosting real, CORS/fallback SPA reales y auditoría de vulnerabilidades F8. Touch físico, lector de pantalla y zoom nativo pendientes. El rediseño no declara producción lista ni modifica reglas comerciales.

## Postdeploy checks

- Verificar deploy real y acceso público a og-image.png/manifest/favicon/iconos nuevos.
- Comprobar caché de favicon y Open Graph; refrescar/instrumentar validadores de plataformas si corresponde.
- Revisar previews WhatsApp/Facebook sin afirmar actualización antes de comprobarla.
- Smoke de Home/filtros/slugs/carrito/retry/WhatsApp con Cajora real y hosting.
- Touch físico y lector de pantalla real; revisar peso/LCP con fotos reales.
