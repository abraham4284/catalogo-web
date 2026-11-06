# F10.3 — VITRUNO Storefront Wholesale Pricing

Fecha: 2026-11-05. Implementado sobre `dev`, inicialmente limpio. Frontend únicamente; sin operaciones de escritura Git.

## Implemented

Contrato de catálogo con política global y precios duales, fuente compartida de negocio, UI comercial de producto, snapshot Cart v4, dominio de precios derivado, Header/preview/carrito coherentes y WhatsApp consciente del nivel. Revalidación de ambos precios y valores efectivos en checkout Meta. Se conservan stock, identidad, cantidades, consultas individuales y encargos F21B.

## API contract

Lecturas reales de Cajora local, sin cambiar backend:

- `GET http://localhost:3000/api/public/catalog`: `pricing.wholesaleEnabled: true`, `wholesaleMinimumAmount: 50000`.
- Listado público: `price`, `priceSale`, `priceWholesale`. En la lectura de hasta 60 se devolvieron 23 productos, 15 con mayorista null y ninguno sin priceSale.
- Ficha `adaptador-usb-c-redondo`: priceSale 4200 y priceWholesale 3900; ambos campos confirmados en detalle.

El valor observado 50000 es un dato de API, no una constante de aplicación. Los casos disabled, error y cambios de política se simularon con fixtures; no se modificó configuración comercial real.

Schemas requieren política con boolean y mínimo finito no negativo; minorista finito no negativo. Mayorista válido es finito y positivo, nullable. Mayorista inválido/ausente se normaliza conservadoramente a null, incluso ante dato ajeno al contrato, para permitir retail sin inventar precio. `price` continúa en DTO por compatibilidad; la lógica comercial, SEO y analítica de producto usan priceSale.

## Pricing domain

`calculateCartPricing` calcula retailSubtotal, wholesaleCandidate, effectivePricingType, effectiveSubtotal, wholesaleAmountRemaining, wholesaleSavings, allItemsHaveWholesalePrice y líneas finales unitPrice/lineTotal.

WHOLESALE requiere política habilitada, carrito no vacío, mayorista válido en todas las líneas y candidato mayorista >= mínimo global. El candidato es suma de `round-half-up(quantity * priceWholesale, 2)` por línea. RETAIL en cualquier otro caso; no se mezclan líneas mayoristas con fallback minorista. Categorías no intervienen en elegibilidad y pueden combinarse. Quitar/reducir líneas recalcula inmediatamente ambos sentidos; debajo del mínimo sigue habilitado retail si pasa el gate de verificación.

Redondeo compartido `moneyLineCents`: representación decimal/exponente de number, multiplicación entera mediante BigInt nativo, half-up por línea y suma en centavos. Evita empates binarios como 1.005 × 3; sin librería monetaria. Los resultados deben caber en centavos enteros seguros de number. No se suman envío ni descuentos ni se usa el subtotal minorista para alcanzar el mínimo. Ahorro solo al calificar; si una línea carece de mayorista no se muestra un faltante engañoso.

## Cart v4 / storage

Clave `catalogo-web-cart`, versión 4. Campos por item: idProduct, slug, name, priceSale, priceWholesale, imageUrl, availabilityStatus, stockAvailable y quantity. No se persisten nivel, importes efectivos, total, ahorro, candidato, faltante ni política.

Migración explícita de v3 válido: conservar identidad/selección/cantidad, price → priceSale, priceWholesale → null. Nunca se inventa mayorista ni se hereda un campo ajeno al snapshot v3. Revalidación recupera precios actuales; la siguiente mutación escribe v4. Versiones v1/v2/futuras, corrupción, duplicados e inputs inválidos producen vacío seguro. Storage bloqueado o lleno conserva acciones en memoria.

Reconciliación compara ambos precios, preserva quantity y evita escrituras idénticas. Verificación mantiene concurrencia, identity id/slug, fallos parciales, failedProductIds y cancelación. Un cambio de precios puede modificar el nivel y el total sin cambiar quantity. Solo éxito completo y carrito coherente habilitan checkout; mayorista no altera stock/on_order ni crea reservas.

## Policy loading

`features/catalog/store/business.store.ts` centraliza negocio y política. StoreRoute solicita al montar/navegar; promesa pendiente deduplicada, caché de éxito de 60 segundos y error de 15 segundos. Reintento explícito en carrito. Sin polling, requests por card/cantidad ni persistencia de política. Home deja de depender de la respuesta del negocio para mostrar categorías/productos.

Loading/error de política quita elegibilidad y promociones mayoristas y mantiene retail. El estado se informa en carrito y no bloquea la compra minorista validada. No se conserva una política anterior como autoridad durante un refresh fallido. La caché se revisa al navegar/reintentar, no con temporizador; la confirmación definitiva permanece con el operador.

## Product UI

ProductPrices compartido muestra precio minorista y, si se habilita mayorista, precio mayorista o «No disponible». Sin cero ficticio para null/inválido. ProductCard se reutiliza en Home, catálogo y relacionados. Mínimo y categorías combinables se explican globalmente en Home/catálogo y cerca del precio en ficha, sin repetir el párrafo por card.

Encargos mantienen aviso del 30%, nota Cajora, CTA Consultar y encargar y una FAQ contextual; no se agregan al carrito. Hero, galería, rich content, branding, rutas y mensajes de consulta individuales conservan su alcance. Las consultas individuales se adaptan a priceSale como fuente del precio publicado.

## Cart UI

App combina política y snapshots mediante useStorefrontPricing y pasa el resultado a Header, CartPreview y CartPage. Filas muestran precio y subtotal efectivos, con etiqueta «Precio unitario mayorista» cuando corresponde. Resumen/preview anuncian con aria-live polite el nivel, ahorro o faltante. Línea sin mayorista explica por qué no califica el conjunto; disabled no ofrece promoción, faltante o ahorro.

Se agrega aclaración para que clientes mayoristas existentes contacten por WhatsApp y sean reconocidos por el operador. No hay login, lookup de Customer ni selector manual. Se optó por copy compacto sin barra de progreso, que era opcional.

## WhatsApp

App transforma líneas finales a name/quantity/unitPrice/lineTotal y pasa RETAIL/WHOLESALE. WhatsApp valida consistencia de importes, formatea con el formatter existente y construye el mensaje; no decide elegibilidad.

Minorista: tipo explícito y total estimado a priceSale. Mayorista: tipo explícito, precios priceWholesale, total mayorista y aclaración de cumplimiento del mínimo para alta mayorista. Se conserva pedido de confirmación de precio/disponibilidad y apertura por interacción explícita. Sin endpoint de órdenes, envío automático, pago o reserva. Los CTAs individuales/flotante no se convierten en checkout mayorista.

## Analytics / SEO

ViewContent y AddToCart reciben priceSale, incluso si el snapshot permitiría mayorista. InitiateCheckout recibe cantidades y precios efectivos de la composición de carrito validado. Transporte reutiliza solo redondeo monetario compartido para sumar, sin reglas de nivel. Se conservan PageView/Contact/consentimiento; sin nuevos eventos ni Purchase.

Offer único de Product JSON-LD usa priceSale; no se publica Offer mayorista. Canonical, OG/Twitter, availability triestado de F19, robots y sitemap conservados. Encargos siguen omitiendo availability. El asset OG versionado sigue en uso.

## Automated tests

Desde `client/`:

- `node --test tests/*.test.cjs`: **78 pruebas, 78 pasan**, cero fallos/omitidas.
- `npm run lint`: OK.
- `npm run build`: OK.

65 pruebas previas adaptadas al contrato nuevo, con cobertura de sus reglas conservada, más 13 casos. Se incluyen política válida/disabled, ambos precios/null/invalidación, precios de compatibilidad distintos a retail, disabled/empty/below/exact/above, categorías combinadas, cambios de cantidad/eliminación, faltante/ahorro, decimal half-up por línea, migración v3, persistencia exclusivamente v4 y ambos precios durante revalidación. Pruebas existentes mantienen corrupción/versiones futuras/duplicados/storage lleno/bloqueado, identidad, abort y éxito parcial. WhatsApp retail/wholesale y valores diferenciados de Meta; Offer retail ante otros precios distintos.

## Browser QA / Responsive QA

Edge headless, API de fixtures local y SDK Meta interceptado con ID de prueba. WhatsApp interceptado para no abrir ni enviar consultas reales.

Desarrollo: 42 combinaciones, siete recorridos en 320/375/768/1024/1440/1920: Home dual, catálogo/mayorista ausente, ficha/SEO/analytics retail, carrito en mínimo exacto con categorías mixtas, cambios above/below/checkout, Side Cart/foco y encargo. Sin overflow horizontal del documento. Cambios de cantidad no agregan requests; Home hace una sola consulta de negocio, no una por consumidor.

Escenarios adicionales: missing wholesale mantiene retail; disabled sin incentivo; loading de política permite minorista y luego actualiza; fallo de política permite minorista y retry recupera; revalidación cambia ambos precios/nivel conservando quantity; error parcial y agotado bloquean checkout; v3 migra hasta revalidar; cambiar mínimo del fixture cambia la UI/elegibilidad. Importes largos probados en carrito/preview en seis anchos.

Build compilado local: 14 combinaciones en 375/1440 más escenarios funcionales; búsqueda y query, FAQ agrupada/Enter, Contacto, Cómo comprar y 404/noindex comprobados. OG versionado, Offer retail, ViewContent/AddToCart retail e InitiateCheckout efectivo verificados. Sin Purchase y sin errores de página en ambos recorridos finales.

Capturas de carrito mobile y Side Cart desktop después de completar la transición, y panel comercial de ficha mobile, inspeccionadas visualmente. Escape devuelve el foco al acceso del carrito; reduced motion conserva ausencia de animación de ruta. No se ejecutaron lector de pantalla o dispositivos físicos ni una auditoría manual de cada ruta histórica del MVP.

## Performance

Baseline medido antes de modificar código: 447 módulos transformados; principal 496.25 kB / gzip 156.20, runtime 102.27 / 34.06 y contenido inicial 5.79 / 2.08. JS inicial agregado **604.31 / 192.34 kB**. CSS **45.07 / 8.66 kB**.

Build F10.3 antes del ajuste visual posterior: 453 módulos; principal 299.07 / 94.27, runtime 102.27 / 34.06, contenido 5.79 / 2.08, whatsapp-url compartido 92.15 / 27.01 y ProductCommerceActions compartido 111.66 / 37.36. JS inicial agregado **610.94 / 194.78 kB**; diferencia **+6.63 / +2.44 kB**. Todos esos chunks aparecen en las precargas iniciales: la caída del principal aislado no representa una reducción total. CSS permanece **45.07 / 8.66 kB**. Ficha lazy 4.25 / 1.74 frente a 4.14 / 1.68 del baseline.

Sin nuevas dependencias, cambios de lockfile, umbrales o manualChunks. Sin aviso de chunk >500 kB. Se usan Zustand y primitives existentes; BigInt es nativo. Sin medición de Core Web Vitals o perfil de CPU/red real. Tras probar con fixtures se restauró el build con configuración local normal; no se alteraron archivos env.

## Known limitations / Regression

El visitante anónimo no reconoce un Customer mayorista existente; la condición se resuelve con el operador en WhatsApp/Cajora. No hay sesión Customer, pago, backend de órdenes ni reserva. Cotización y condiciones definitivas deben confirmarse. Un snapshot o política puede quedar desactualizado hasta su refresco; quantity no genera requests deliberadamente.

API real verificada únicamente en local para contrato; matriz funcional realizada con fixtures, incluida política disabled/error. No se afirma deploy/producción validada, recepción real en Meta o validación física. Pendientes previos de Search Console/Meta, políticas jurídicas y mecanismo real de arrepentimiento no forman parte de este cambio. Sin bloqueos de implementación conocidos.

No se rediseñó Hero ni se cambió el backend. Fuente de política en Catalog/store, en lugar de crear otro contexto en app, reutiliza la frontera existente y mantiene composición entre features en app.

## Evidence

Directorio local `C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/`: `f10-3-qa.cjs`, `f10-3-results.json`, `f10-3-production-qa.cjs`, `f10-3-production-results.json`, capturas `f10-3-cart-375.png`, `f10-3-cart-1440.png`, `f10-3-side-375.png`, `f10-3-side-1440.png`, `f10-3-product-375.png` y `f10-3-product-1440.png`. Scripts/capturas fuera del repositorio.

## Ajuste visual posterior — Jerarquía de precios
Componentes modificados en este ajuste exclusivamente: ProductPrices, ProductCard y ProductDetail. Mayorista válido dominante (24 px cards / 30 px ficha), label junto al importe, minorista visible en línea secundaria de 14 px, sin tachado ni «Desde» en el precio del producto. Mayorista ausente conserva minorista principal y texto No disponible; política deshabilitada conserva solo minorista. WholesaleNotice permanece intacto y usa el mínimo dinámico existente.

Cards limitan descripción a dos líneas con CSS; texto original intacto. Área de precios con min-height 96 px al mostrar ambos niveles. 18 casos locales (cards y fichas con/sin mayorista en 320/375/768/1024/1440/1920), sin errores de página u overflow. Bloques de precios de cards con/sin mayorista midieron la misma altura dentro de tolerancia subpíxel (<1 px). No se afirma CLS medido. Capturas cards desktop y ficha mobile inspeccionadas; script también cubrió disabled.

78 pruebas existentes, lint/build OK. Ningún cambio en dominio mayorista, mínimo, cálculo de candidato, transición, estado/persistencia, API, mensajes o analítica. Única prop nueva: variante visual card/detail en ProductPrices.

Build posterior: principal 299.07/gzip94.26, ProductCommerceActions 111.90/37.45; demás chunks iniciales sin cambios. Total JS inicial 611.18/gzip194.86 kB; CSS45.19/gzip8.68. QA en desarrollo con fixtures; no despliegue nuevo ni verificación productiva. Evidencia en el mismo directorio: f10-3-polish-qa.cjs, f10-3-polish-results.json y capturas f10-3-polish-cards-375/1440.png, f10-3-polish-detail-375/1440.png.
