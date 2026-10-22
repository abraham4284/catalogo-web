# F16 — Navigation + Side Cart + Contact / Guidance Pages

Fecha: 2026-10-22. Implementación y corrección visual sobre `dev`. Sin escritura Git.

## Implemented
- Side Cart accesible, Header con cantidad en mobile y cantidad/total desde lg; Footer y navegación ampliados.
- Rutas lazy `/contacto`, `/como-comprar` y `/preguntas-frecuentes`.
- Pasos/FAQ reutilizan arrays de storefrontContent y componentes con Home.
- Sin dependencias nuevas, cambios backend, contratos Cajora ni almacenamiento v3.

## Corrección visual solicitada
La primera versión reservaba un carril derecho de 160 px y una banda inferior para un acceso persistente; esto dejaba una franja en blanco y comprimía el sitio. Se retiraron el carril, la banda y el botón flotante. StoreLayout vuelve al ancho completo y al scroll natural del documento, con Header/Footer de extremo a extremo y main centrado con su ancho máximo habitual.

El usuario sustituyó el comportamiento inicial de apertura tras agregar: ahora el Side Cart se abre exclusivamente por clic en Carrito del Header. AddToCartButton y ProductCommerceActions ya no dependen del panel ni emiten callbacks de apertura. Bajo lg el Header muestra Carrito y cantidad, sin importe; los totales dentro del panel y de /carrito permanecen visibles.

## Side Cart
CartPreview reutiliza el store y CartItemRow con IDs propios. Imágenes/fallback, nombres, cantidades, estados, subtotales, unidades y total conservan las reglas existentes. No revalida ni ofrece checkout directo: “Ver carrito completo” cierra y lleva a `/carrito`, donde permanece la única coordinación de verificación. Estado UI no persistido, panel cerrado sin ocupar espacio, sin apertura por agregado/hidratación/reconcile/navegación.

## Navigation
Cinco rutas en navegación expandida desde xl; debajo, Menú usa el mismo Dialog. Header ofrece el acceso al carrito, Footer incluye rutas de ayuda/contacto y /carrito. Apertura del menú independiente del carrito.

## Contact
Zod requiere nombre/mensaje tras trim, límites 80/2000; email opcional con validación/límite 254 si se informa. Mensaje de contacto independiente de checkout/consulta individual. Configuración y URL builder existentes, noopener/noreferrer y enlace para reabrir si el navegador bloquea la ventana. Sin POST, persistencia personal ni contacto real con WhatsApp durante QA: window.open interceptado e inspeccionado.

## Guidance
BuyingSteps/FaqList reciben los mismos arrays que Home: tres pasos y siete preguntas, con details/summary nativos. Sin duplicar condiciones comerciales.

## Automated validation
Desde client, después de la corrección:
- `node --test tests/*.test.cjs`: 42 pasan, 0 fallos (catálogo 17, carrito 16, WhatsApp 9).
- Tres pruebas de contacto: schema/límites/normalización, mensaje sin mutación y URL/configuración/encoding.
- `npm run lint`: OK.
- `npm run build`: OK, TypeScript estricto; sin aviso de chunk >500 kB.

## Responsive QA
Edge headless con fixtures HTTP locales aisladas. Corrección validada en 48 combinaciones: ocho rutas × 320/375/768/1024/1440/1920 px, alto 900.

Rutas: Home, catálogo, detalle, carrito, contacto, cómo comprar, FAQ y 404. Sin overflow horizontal. Header ocupa exactamente el ancho útil del documento; no existe #store-scroll ni espacio lateral/inferior reservado. Footer alcanzable mediante scroll natural. Un único botón #cart-access en Header; importe oculto bajo 1024 y visible desde 1024. Capturas desktop 1920 y mobile 375 revisadas.

Agregar desde Home/catálogo/detalle mantiene panel cerrado; contador acumulado correcto. Reload con carrito hidratado también cerrado. Clic en Carrito abre el panel; incremento actualiza unidades, CTA lleva a carrito completo y permite continuar solo tras la verificación existente.

La QA inicial de F16 también verificó stock excedido/agotado/encargo, tres productos con scroll, nombre extenso/fallback e importes de más de dos billones; búsqueda/categoría/paginación, galería, consulta individual y checkout loading/error/retry. Esos recorridos previos son históricos; su expectativa de apertura automática y las capturas con carril reservado quedaron sustituidas por la corrección.

## Accessibility QA
Dialog Base UI existente: título/descripción, overlay, Escape y gestión modal de foco. QA de corrección: Tab mantiene foco dentro del panel, Escape/overlay devuelven al botón del Header; navegación al carrito completo cierra. La QA inicial comprobó menú, ruta actual, validación/foco de campos y FAQ por teclado. No se ejecutó lector de pantalla real.

## Performance
Tamaños Vite en kB decimales tras corrección. Sin dependencias nuevas; Dialog/composición se cargan al primer uso, páginas nuevas con lazy.

| Asset | Minificado | gzip |
| --- | ---: | ---: |
| Principal F15 | 500.82 | 156.10 |
| Principal F16 con polish | 318.34 | 100.64 |
| jsx-runtime compartido inicial | 8.90 | 3.38 |
| chunk compartido inicial | 93.29 | 30.95 |
| schemas compartido inicial | 86.31 | 24.53 |
| Total JS inicial vigente | 506.84 | 159.50 |
| StorePanels diferido | 58.17 | 19.89 |
| ContactPage diferido | 4.39 | 1.70 |
| HowToBuyPage diferido | 1.07 | 0.54 |
| FaqPage diferido | 0.75 | 0.47 |
| CatalogPage diferido | 1.55 | 0.77 |
| ProductDetailPage diferido | 0.78 | 0.44 |
| CSS F15 | 36.88 | 7.24 |
| CSS vigente | 41.00 | 7.84 |

La extracción automática de módulos compartidos reduce el principal, pero el total inicial vigente crece 6.02 kB minificado / 3.40 gzip frente a F15. La cápsula y su icono reutilizan la dependencia Phosphor existente; no se agregan paquetes. Sin manualChunks ni mediciones de Core Web Vitals.

## Known limitations
QA con fixtures locales: smoke de hosting/backend, CORS/fallback SPA, número real, dispositivos físicos/Safari y lector de pantalla pendientes. No se abrió WhatsApp real ni se enviaron mensajes. El preview muestra el snapshot conocido; verificación comercial en /carrito. Agregar no reserva stock.

## Evidence
En `C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/`:
- Vigentes: f16-fix-qa.cjs, f16-fix-results.json; 48 casos, cuatro comprobaciones adicionales, cero errores JavaScript.
- Capturas vigentes: f16-fix-1920-catalog.png, f16-fix-375-catalog.png, f16-fix-375-cart.png.
- Históricas de la primera versión: f16-qa.cjs/results y f16-regression.cjs/results, capturas f16-* sin prefijo fix.

Sin bloqueos identificados. La corrección de UX solicitada por el usuario reemplaza los criterios iniciales de acceso persistente y apertura automática.

## Polish de cápsula y transición
Solicitud posterior: acceso del Header inspirado en referencia de bolsa con contador. Se incorpora cápsula con borde, contador superpuesto y “Mi pedido”/total desde lg; mobile conserva etiqueta Carrito y cantidad sin importe.

SidePanel desliza en 250 ms ease-out y backdrop hace fade de 200 ms mediante atributos de Base UI. El último contenido del panel se conserva durante la salida; no cambia el menú a carrito al cerrarlo. prefers-reduced-motion usa transition-property:none.

Lint/build ejecutados y correctos. Edge con fixtures: seis anchos 320/375/768/1024/1440/1920, sin overflow, cápsula con mínimo 44 px, total visible solo desde lg, clic/Escape y retorno de foco. Medidos desplazamientos intermedios de entrada/salida; título del menú estable durante cierre. Agregado conserva panel cerrado, diez unidades y edición/CTA al carrito completo preservados. Tab atrapado en diálogo. Reduced motion sin animaciones activas. Sin errores JavaScript capturados. Las 42 pruebas de dominio/contratos corresponden a la corrección anterior; no se modificaron esas reglas en este polish.

Evidencia adicional en el mismo directorio: f16-polish-qa.cjs, f16-polish-results.json y f16-polish-375-header.png, f16-polish-1440-header.png, f16-polish-1440-filled-header.png.
