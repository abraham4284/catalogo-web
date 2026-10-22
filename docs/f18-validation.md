# F18 — Route Transition + Navigation Prefetch

Fecha: 2026-10-22. Rama dev, limpia al iniciar. Sin operaciones de escritura Git.

## Implemented
- Transición CSS de entrada exclusivamente para contenido del Outlet.
- Loaders reutilizados por React Router y prefetch de intención.
- Header, menú compacto y Footer con pointerenter/focus.
- Recuperación frente a import fallido, sin errores de promesa sin manejar.
- Sin dependencias nuevas, cambios de API/dominio/cart/toast ni loaders de navegación.

## Route transition
StoreLayout usa un div route-enter con key=pathname dentro del main existente. Opacity 0→1 y translateY 5→0, 180 ms ease-out. Sin fade-out, timers ni demora artificial. Main enfocable y efecto de StoreRoute conservados; AnnouncementBar/Header/Footer/SidePanel/toast quedan fuera del wrapper. Se anima también la entrada inicial, sin alterar los estados reales de carga del contenido.

/productos con page/categoria/search conserva el nodo del wrapper y el filtro de categorías; no se reinicia la transición global ni se remonta la página por la key. Back/Forward con distinto pathname admite la misma entrada. Reduced motion usa animation:none; sin smooth-scroll global.

## Prefetch
Loaders en app/route-loaders.ts son usados por router.lazy y navigation-prefetch.ts. Mapping de /productos, /contacto, /como-comprar y /preguntas-frecuentes. No se prefetchean API, productos individuales ni carrito. Rutas restantes conservan comportamiento previo; detalle continúa lazy.

Header y Footer reciben un callback de app; shared no importa páginas/app. Menú usa el mismo mapping desde StorePanels. Hover/foco precargan código; montar el Storefront no dispara todas las rutas. No hay spinner/skeleton de navegación ni sustitución de los estados reales de catálogo/detalle/revalidación.

### Recuperación de fallos
QA detectó que capturar el rechazo no bastaba: tras abortar la descarga de FAQ, el navegador conservaba el import fallido y la navegación normal también fallaba. Se añadió createRecoverablePageLoader: tras un fallo, la siguiente carga usa una URL independiente con ?navigation-retry. No se reintenta ni se descarga ese módulo en el camino saludable. Los tipos de los módulos alternativos corresponden a los exports reales.

Las cuatro variantes añaden pequeños assets de recuperación al build, sin duplicar imports en router/prefetch ni las dependencias pesadas. No hay recarga de documento, espera artificial ni loop de reintentos. Si ambos recursos siguen inaccesibles, el error de navegación lo gestiona React Router normalmente.

## Automated
Desde client:
- node --test tests/*.test.cjs: 45 pasan, 0 fallos. Catálogo 17, carrito 16, WhatsApp 9, loader 3.
- Nuevas pruebas puras: camino saludable no usa recuperación; fallo primario permite navegación por la vía alternativa; error persistente se propaga al router.
- npm run lint: OK.
- npm run build: OK, con aviso existente de chunk principal >500 kB.
- git diff --check: sin errores de whitespace; avisos LF/CRLF del checkout Windows.

## Responsive
Edge headless y fixtures HTTP locales. 320/375/768/1024/1440/1920 × cinco saltos = 30 cambios de ruta:
/ → /como-comprar → /preguntas-frecuentes → /contacto → /productos → /.

En cada ancho: entrada con duración computada 180 ms, Header/Footer sin animación de ruta, sin overflow horizontal; menú compacto en los cuatro anchos bajo xl, cerrado al navegar. Foco queda en main o en su contenido según restauración de Base UI; Back/Forward entre rutas enfoca main.

También en los seis anchos: categoría, paginación y búsqueda conservan nodos del wrapper/categorías. Back de queries conserva instancia; Back/Forward entre páginas restaura ruta y foco. Skip link lleva a main y reduced motion desactiva route-enter. Se verificó hover de Header y foco del menú como intención, sin navegación previa ni nuevas requests API.

## Accessibility
Main mantiene id/tabIndex y foco visible fuera del wrapper animado. Navegación por teclado/skip link y aria-current comprobados. Reduced motion elimina la animación en vez de reemplazarla. El diálogo conserva el trap (incluido Shift+Tab), Escape y acceso al carrito completo; no se cambió su implementación ni el toast.

## Build local / regresiones
Build con configuración temporal de fixtures, sin editar .env; luego recompilado con configuración normal.
- Ninguna descarga de módulos de páginas lazy solo por montar Home.
- Foco sobre Cómo comprar descarga su chunk antes del clic; 19 fotogramas intermedios de entrada observados en una corrida con opacity entre 0/1 y desplazamiento entre 0/5 px.
- Header/Footer mantienen sus nodos durante el cambio y aria-current corresponde a la ruta activa.
- Abortado el primer chunk de FAQ: prefetch no produce rechazo sin manejar y clic carga la variante recuperable. Comprobado tanto en Vite dev como en build de producción.
- Foco sobre Contacto del Footer descarga el chunk sin navegar.
- Detalle permite agregado con toast existente y sin autoabrir el panel; Side Cart, Shift+Tab y CTA al carrito completo preservados. Revalidación/WhatsApp bloqueados ante error y habilitados tras retry.
- Cero errores JavaScript capturados en los recorridos finales.

## Performance
Tamaños Vite, kB decimales con configuración normal:

| Asset | F17 vigente min / gzip | F18 min / gzip |
| --- | ---: | ---: |
| Principal | 571.64 / 180.75 | 572.42 / 181.06 |
| jsx-runtime inicial | 8.90 / 3.38 | 8.90 / 3.38 |
| JS inicial total | 580.54 / 184.13 | 581.32 / 184.44 |
| CSS | 42.06 / 8.05 | 42.27 / 8.09 |
| CatalogPage normal | 1.51 / 0.74 | 1.51 / 0.75 |
| ProductDetailPage | 0.74 / 0.41 | 0.74 / 0.42 |
| HowToBuyPage normal | 1.03 / 0.52 | 1.03 / 0.52 |
| FaqPage normal | 0.71 / 0.45 | 0.71 / 0.45 |
| ContactPage normal | 4.36 / 1.69 | 0.49 / 0.34 |
| Contacto compartido diferido | — | 3.97 / 1.55 |

Inicial JS +0.78 kB min / +0.31 gzip; CSS +0.21 / +0.04. Las cuatro variantes de recuperación suman 3.74 kB min / 2.06 gzip emitidos, pero no se transfieren en el flujo saludable. Contacto reparte su código en página y módulo compartido normal/retry, sin volverlo eager. No se agregaron paquetes, manualChunks ni ajustes para ocultar la advertencia de 500 kB. Prefetch adelanta descargas solo ante intención; no se midieron Core Web Vitals ni un tiempo garantizado de navegación.

## Known limitations
QA local con fixtures; no se usó backend/hosting real, Safari, dispositivos físicos ni lector de pantalla real. Lazy navigation todavía depende de red/CPU y una caída persistente del recurso puede impedir navegar; no se promete éxito si también falla la vía alternativa. El prefetch puede consumir datos aunque finalmente no se haga clic. No se garantiza restauración exacta de scroll histórica: se mantiene la política existente de foco al main en cambios de pathname.

## Evidence
Directorio C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- f18-qa.cjs y f18-qa-results.json: 30 cambios, queries/historial/skip/reduced motion y fallo recuperado.
- f18-production-qa.cjs y f18-production-results.json: fotogramas, chunks, recuperación y regresión comercial.

Sin bloqueos. La vía de recuperación amplía los loaders básicos debido a un fallo de caché de módulos reproducido en QA; responde al requisito de navegar tras un prefetch fallido.
