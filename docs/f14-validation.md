# Validación F14 — Production UI Polish

Fecha: 2026-10-21. Rama dev. Polish acotado a HomeHero y alineación/escala de Header/Footer; sin nuevo rediseño.

## Implemented

- HomePage pasa status explícito loading/success/error al Hero. Selección visual: primer producto con imageUrl; si no hay ninguno, primer producto existente. Listado, orden, paginación y fetching no cambian.
- Skeleton neutral durante loading, sin logo, texto ni enlace de producto; decorativo aria-hidden. Pulso solo con motion-safe; visual lateral sigue oculto bajo md.
- Un único frame para todos los estados: aspect 4/5, max-height 448 px y 40 px reservados para leyenda de hasta dos líneas. Sin salto del área del Hero al llegar la API.
- Producto existente sin imagen usa ProductImage/Sin imagen y conserva enlace. Éxito vacío/error usan isotipo editorial decorativo. ProductImage global no se modificó.
- Logo corregido integrado con dimensiones intrínsecas reales; Header/Footer mobile centrados y escala desktop contenida.

No se modificaron useCatalogHome, Promise.all, AbortController, API, schemas, routing, dominio, carrito v3/revalidación ni WhatsApp. Sin dependencias, cache o store nuevos. Paleta, fonts, cards, catálogo, detalle, galería, HomeEditorial, HomeBuyingGuide y metadata F13 conservados.

## HomeHero loading

QA con Edge headless y fixture HTTP aislado. Flujo ejecutado: Home → enlace de producto del Hero → detalle → Inicio, con API demorada 1400 ms al regresar.

Durante loading se comprobó: cero imágenes y enlaces dentro del visual, texto vacío, aria-hidden y skeleton presente. Luego apareció el producto sin paso intermedio por la marca. Se compararon bounding boxes antes/después en el mismo scroll: Hero, panel, frame y titular conservaron x/y/ancho/alto, diferencia menor a 1 px (en la medición, 0).

Medición a 1440 px:

| Área | Loading | Producto |
| --- | --- | --- |
| Hero | 1216×547.98 px | 1216×547.98 px |
| Panel lateral | 535.81×499.98 px | 535.81×499.98 px |
| Frame | 358.39×447.98 px | 358.39×447.98 px |
| Titular | 616.17×233.25 px | 616.17×233.25 px |

El aspect ratio y max-height existentes pueden limitar el ancho efectivo del frame dentro de la columna. Es idéntico en skeleton/producto/fallback. El caption reserva 40 px incluso si ocupa una línea o está vacío.

También comprobado: primer producto sin imagen y segundo con imagen selecciona el segundo para Hero; todos sin imagen conservan el primero, enlace y Sin imagen; catálogo vacío y error muestran isotipo sin link; las dimensiones del frame se mantienen. En mobile el visual de carga está oculto por el mismo breakpoint.

Requests al volver a Home: solo familias catalog/categories/products ya existentes; duplicados/cancelaciones de StrictMode en dev. Cero detail requests para la selección visual. Esto no es una medición de CLS global ni de Core Web Vitals: los estados/listados inferiores siguen el flujo existente, sin cache nueva.

## Header

Nuevo PNG aportado por el usuario antes de comenzar:

```text
client/public/vitruno-logo-horizontal.png
PNG RGBA: 1200×630
Peso: 108920 bytes
Alpha: 254–255, prácticamente opaco
Fondo en esquina: rgba(36,32,56,255) / #242038
SHA-256: 0e195e91c1ada83216c4f30c0f8f0843544ff429aff1f1257eb7d3f17eba334b
```

Inspeccionado visualmente: wordmark blanco mayor y proporción V/nombre corregida; conserva márgenes raster. No se editó/recreó el PNG ni los otros assets. BrandLogo declara width/height 1200/630 y object-contain.

Mobile: isotipo 64 px centrado, gap de 8 px y navegación centrada debajo. Desktop: horizontal izquierda, navegación derecha; caja 208 px, 224 desde lg, reemplazando 320/384. Altura medida de Header: 132 px en mobile, 117.19 px a 768 y 125.59 px desde 1024 (sin announcement). Sin recorte/deformación.

Se conservan Inicio/Productos/Carrito, aria-current, contador, aria-label y foco claro. Link de marca tiene un solo nombre accesible VITRUNO; variante CSS oculta no duplica imágenes visibles.

## Footer

Mobile: logo horizontal, nota y navegación centrados. Logo 208 px, nota con max-width y margin auto; wrap seguro, targets existentes y padding vertical 32 px. Desktop conserva identidad/nota izquierda y navegación derecha; logo 208/224 px según breakpoint. Sin cambios de enlaces o copy.

Centro medido de logo/nav/nota: x=160 en 320 px y x=187.5 en 375 px, sin desviación mayor a 1 px. En desktop logo a izquierda de navegación. Escala menor y composición revisadas en capturas desktop/mobile.

## Responsive

| Ruta | 320 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| / | OK | OK | OK | OK | OK |
| /productos/producto-disponible | OK | OK | OK | OK | OK |
| /productos | OK | OK | OK | OK | OK |
| /carrito | OK | OK | OK | OK | OK |

20 combinaciones con scrollWidth sin superar innerWidth, un h1 y cero controles interactivos anidados. Logo mobile centrado y variante adecuada; desktop horizontal cargado a 1200×630 y layout izquierda/derecha conservado. Capturas Home en 320/375/1440 y loading desktop; Home desktop/mobile/loading revisadas visualmente. Fotos son fixtures neutros, no datos de producción.

Carrito con 10 unidades y aria-label correcto verificados; error/retry mantiene gate y habilita enlace tras éxito. Se vació solo el carrito del contexto aislado; no se abrió WhatsApp ni se enviaron mensajes. Ningún pageerror.

## Accessibility

Skeleton y fallback editorial aria-hidden; sin falso contenido o enlace durante loading. Producto sin imagen conserva fallback semántico compartido. Nombre accesible completo del producto mediante aria-label aunque la leyenda visual se limite a dos líneas.

Reduced-motion emulado: animationName none en skeleton. Skeleton solo ocupa el espacio lateral desde md. Logo con alt VITRUNO y variante oculta por display:none; nav labels y badge preservados. Skip link alcanza main-content; foco de logo medido outline 2 px, rgb(250,250,252). Sin auditoría WCAG completa ni lector de pantalla físico.

## Automated validation

Desde client:

```text
node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs
39 passed / 0 failed: catálogo 17, carrito 16, WhatsApp 6
npm run lint: OK
npm run build: OK, sin warnings en la versión final
git diff --check: OK
```

Build final:

| Asset | Minificado | Gzip |
| --- | --- | --- |
| JS principal | 499.98 kB | 155.78 kB |
| ProductDetailPage | 0.70 kB | 0.39 kB |
| CatalogPage | 1.47 kB | 0.72 kB |
| CSS | 36.88 kB | 7.24 kB |

Sin nuevas dependencias, framework DOM ni tests que espejen clases. QA usa Playwright/Pillow del runtime fuera del proyecto. Frente a F13, JS +0.52 kB y CSS +0.66 kB; principal muy próximo al umbral de 500 kB. El markup del frame se comparte entre estados para preservar geometría y evitar duplicación; no se cambió el umbral de aviso.

Servidor local de QA en 5175 y fixture en 5176, con contexto de navegador separado. No se alteraron .env, backend o sesiones del usuario. Console Ninja necesitó conexión local fuera del sandbox para iniciar Vite; configuración del proyecto intacta.

## Known limitations

Validación local con API demorada/fixtures; no se verificó deploy ni navegación contra Cajora en producción. La medición prueba estabilidad del Hero, no garantiza CLS global cero. Sigue sin cache global por alcance explícito de F14.

Persisten pendientes históricos: smoke Cajora/hosting real, CORS/fallback SPA reales, auditoría de vulnerabilidades F8, touch físico, lector de pantalla real y previews/cachés sociales tras deployment. Branding/assets raster y fuentes externas conservan sus limitaciones previas. Ningún pendiente se declara resuelto por este polish.
