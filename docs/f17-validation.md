# F17 — Add-to-Cart Feedback + StorePanels Preload

> Informe de la implementación inicial. La estrategia de preload y sus métricas fueron sustituidas al corregir la primera apertura: ver docs/panel-first-open-validation.md. El feedback de agregado se conserva; el toast central de Base UI fue sustituido por react-hot-toast inferior con nombre/check (docs/toast-validation.md).

Fecha: 2026-10-22. Rama `dev`, limpia al iniciar. Sin operaciones de escritura Git.

## Implemented
- StorePanels preloaded después del montaje; lazy y code splitting conservados.
- Suspense fallback null: retirado “Abriendo panel…”, sin spinner/skeleton sustituto.
- Retirado el indicador “En carrito: N” de AddToCartButton, compartido por Home/catálogo/detalle.
- Estado local “✓ Agregado” nominal de 1200 ms y toast central de 1500 ms, exclusivamente ante incremento real.
- Sin cambios de dominio, store v3, API, backend, revalidación, routing ni checkout.

## Panel preload
`app/load-store-panels.ts` contiene el único import dinámico reutilizado por lazy y el efecto de StoreRoute. Se ejecuta tras montar, sin bloquear render ni abrir/montar el panel. Rechazos del preload se capturan; React.lazy conserva el manejo al solicitar el panel. No hay petición comercial asociada a precargar código.

En desarrollo se observó la respuesta de StorePanels antes del clic; en build local de producción se comprobó la descarga de `/assets/StorePanels-*.js` sin interacción y con diálogo cerrado. Primer clic en Carrito y Menú tras reload, Escape, Tab y retorno de foco conservados en los recorridos indicados abajo. No se afirma un tiempo exacto de apertura: una red lenta todavía puede demorar la descarga, pero sin UI de carga engañosa.

## Add-to-cart feedback
El componente lee quantity mediante getState antes/después del addItem existente. Solo after > before activa la etiqueta y el toast. No se cambia el retorno void del store. El botón se deshabilita temporalmente, bloquea doble clic y recupera su etiqueta tras 1200 ms; si se llegó al stock, continúa deshabilitado por las reglas existentes. Nunca se presenta “Agregando”. Timer local limpiado al desmontar, sin persistencia.

Comparación de cantidades comprobada con un conflicto real de slug en un snapshot v3 válido: el botón parecía agregable, el store rechazó la operación y no se mostró feedback falso. Sin stock/on_order no ofrecen agregado; límite de stock conserva una sola unidad y no se reactiva al expirar la etiqueta.

## Toast
Primitive Toast de @base-ui/react ya instalado. Un único FeedbackToastProvider en StoreRoute, viewport en portal centrado, aria-live polite y prioridad low. Copy “Agregado al carrito”; se omite nombre para evitar ruido con nombres largos. ID estable cart-added actualiza/refresca una notificación, sin pilas.

Timeout nominal 1500 ms gestionado por Base UI; fade de 150 ms, con prefers-reduced-motion sin transición. Viewport y contenido con pointer-events none, sin acciones; root group/tabIndex -1 evita tratar la confirmación como diálogo interactivo. No hay llamadas de focus ni robo de foco al toast. Deshabilitar el botón puede cambiar el foco por comportamiento nativo del navegador, pero la notificación no lo recibe. Base UI puede pausar tiempos según foco/actividad de ventana.

## Automated
Ejecutados desde client:
- `node --test tests/*.test.cjs`: 42 PASS, 0 fallos (17 catálogo, 16 carrito, 9 WhatsApp).
- `npm run lint`: PASS.
- `npm run build`: PASS, TypeScript estricto y sin aviso de chunk >500 kB.
- Búsqueda en client/src: sin “En carrito:” ni “Abriendo panel”. No se tocaron referencias históricas de docs/tests.
- `git diff --check`: sin errores de whitespace; avisos LF/CRLF propios del checkout Windows.

No se agregaron pruebas puras que dupliquen el código de UI: el nuevo comportamiento depende de React, timers y Toast y se verificó en navegador con el store real. Se mantienen todas las pruebas de contratos/dominio.

## Responsive
Edge headless con fixtures HTTP locales. 18 casos de agregado: Home, catálogo y detalle × 320/375/768/1024/1440/1920, alto 900. Contextos aislados por ancho.

En cada caso: primer/segundo agregado de una unidad, etiqueta Agregado disabled, clic adicional durante ese estado sin incremento, retorno a etiqueta normal, toast centrado/auto-dismiss, Header con unidades correctas y ausencia de diálogo abierto. Ninguna request a la API durante agregado. El preload no produjo apertura. Toast centrado medido en x/y, sin overflow horizontal; nombre extenso de fixture sin agrandar la notificación.

Casos adicionales: dos productos mientras existe el toast (una notificación), agotado/encargo sin agregado/feedback, rechazo por slug conflictivo sin éxito falso y stock límite 1 con reduced motion. CartPage revalida, mantiene gate WhatsApp, bloquea ante error y habilita después de retry. Smoke de Contacto/Cómo comprar/FAQ/404 sin toast residual.

Build de producción local adicional: 375/1440, preload antes del clic, botón y toast con estado final opaco legible, centro medido, Side Cart cerrado tras agregar, clic/Escape/retorno de foco correctos. API/número de fixtures se suministraron por variables temporales al proceso de build, sin editar archivos de entorno; luego se recompiló con la configuración normal.

## Accessibility
Toast con aria-live polite, sin tabulación ni captura de puntero. Verificado que el foco no entra en el viewport al aparecer. Controles de agregado deshabilitados temporalmente y reglas de stock preservadas. El panel mantiene trap por Tab y Escape/retorno de foco en seis anchos. Menú compacto se verificó desde reload en 320/375/768/1024. F16 ya cubría Shift+Tab en el mismo Dialog, cuyo código no cambia en F17.

Reduced motion probado con stock límite: transition-property none en toast, cero animaciones activas. Capturas de build 375/1440 inspeccionadas. Sin errores JavaScript capturados. No se ejecutó lector de pantalla físico ni auditoría Lighthouse.

## Performance
Sin dependencias nuevas. Toast añade código de un paquete ya instalado. Los cambios de chunks provienen de la extracción automática de Vite, sin manualChunks.

Tamaños Vite, kB decimales, configuración normal:

| Asset | F16 min / gzip | F17 min / gzip |
| --- | ---: | ---: |
| Principal | 318.34 / 100.64 | 344.87 / 110.57 |
| jsx-runtime inicial | 8.90 / 3.38 | 8.90 / 3.38 |
| chunk compartido inicial | 93.29 / 30.95 | 93.29 / 30.95 |
| schemas inicial | 86.31 / 24.53 | 86.31 / 24.53 |
| cart compartido inicial | — | 12.13 / 4.38 |
| whatsapp-url compartido inicial | — | 0.60 / 0.43 |
| Total JS inicial | 506.84 / 159.50 | 546.10 / 174.24 |
| StorePanels separado | 58.17 / 19.89 | 38.10 / 13.04 |
| Inicial + StorePanels | 565.01 / 179.39 | 584.20 / 187.28 |
| CSS | 41.00 / 7.84 | 42.25 / 8.03 |

El principal crece 26.53 kB / 9.93 gzip; el total inicial, contando modulepreload del HTML, crece 39.26 / 14.74. StorePanels sigue separado pero F17 lo solicita después del montaje, adelantando 38.10 / 13.04 que F16 descargaba al primer uso. Por eso el total inicial + preload crece 77.36 / 27.78 frente al inicial F16. Comparando ambos con panel descargado, la diferencia es 19.19 / 7.89, que incluye Toast/feedback y reorganización de código. CSS +1.25 / 0.19. El menor chunk del panel no significa una reducción equivalente de transferencia total.

ContactPage 4.39 / 1.71, HowToBuyPage 1.07 / 0.54, FaqPage 0.75 / 0.47, CatalogPage 1.55 / 0.77 y ProductDetailPage 0.78 / 0.44 siguen lazy. No se midieron Core Web Vitals ni latencia de producción.

## Known limitations
- QA contra fixtures locales: backend/hosting reales, CORS, fallback SPA, Safari y dispositivos/lectores físicos siguen pendientes.
- No se abrió WhatsApp real ni se enviaron mensajes.
- Preload adelanta tráfico de JavaScript; red lenta/fallo de chunk puede demorar o impedir el panel. Se elimina el indicador visible, sin prometer apertura instantánea en toda red.
- El snapshot del carrito y la verificación comercial siguen exactamente como F16: no hay reserva de stock ni validación nueva al agregar.

## Evidence
En `C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/`:
- f17-qa.cjs y f17-qa-results.json: 18 casos y comprobaciones adicionales.
- f17-production-qa.cjs y f17-production-results.json: build local, preload observado en ambos anchos.
- Capturas finales inspeccionadas: f17-production-375-feedback.png y f17-production-1440-feedback.png.

Sin bloqueos ni desviaciones de alcance identificadas.
