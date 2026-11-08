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

## Visual polish — F10.3 Wholesale UX (2026-11-06)

### Alcance y rama
El documento de referencia mencionaba qa. El usuario confirmó expresamente implementar en dev, manteniendo dev → qa y promoviendo qa → master cuando termine su revisión. Árbol inicialmente limpio en dev; sin cambio de rama ni operaciones de escritura Git. No se analizó/resolvió divergencia entre ramas.

### Solo minorista y card alignment
ProductPrices cambia el mensaje de mayorista ausente/inválido por «Solo minorista», neutral. Minorista sigue protagonista en ese caso; mayorista válido mantiene su jerarquía y minorista secundario sin tachado. ProductDetail pasa el contexto del SKU a WholesaleNotice: solo minorista recibe explicación propia, sin sugerir que el mínimo global le aplica. El aviso global del catálogo continúa usando la política de Cajora.

ProductCard elimina la descripción visual, conservando el dato original y la descripción completa en detalle. Categoría en una línea; nombre limitado a dos con altura mínima compartida, enlace con nombre accesible completo. Flex, altura mínima del área de precios y acciones alinean precios, badges y final de acciones por fila. La acción única de encargos comparte la geometría, sin hacks por producto.

### Progress bar / Side Cart / CartPage
Helper puramente visual features/cart/utils/wholesale-progress.ts: porcentaje desde wholesaleCandidate/wholesaleMinimumAmount, limitado a 100; no usa retailSubtotal ni effectiveSubtotal. No devuelve progreso con disabled, vacío, alguna línea sin mayorista, candidato no finito/negativo o mínimo no finito/no positivo. Con mínimo cero se omite la barra; el nivel económico sigue derivándose sin cambios por el dominio existente.

CartPricingStatus renderiza status, barra y faltante/ahorro. Variante full en CartSummary ya usado por CartPage, compact en CartPreview. Estado de éxito uniforme «✓ Accediste al precio mayorista», barra 100% al alcanzar/superar un mínimo positivo. Missing wholesale explica productos solo minoristas y omite barra/faltante. Compra minorista debajo del mínimo sigue habilitada con verificación exitosa, stock y cantidades válidas. No se modifican CartSummary o CartPage para duplicar presentación ni se toca su gate.

### Accessibility
role progressbar, aria-label «Progreso hacia el precio mayorista», aria-valuemin/max 0/100, valor actual acotado y texto monetario accesible. Track bg-muted/fill bg-primary; transición de ancho de 200 ms solo motion-safe, sin pulso. aria-live polite de resumen/preview existente. Escape/foco del Side Cart y reduced motion comprobados. Sin lector de pantalla físico.

### Pruebas y responsive QA
88 pruebas pasan (78 existentes sin debilitar assertions + 10 nuevas). Casos nuevos: límites 0/1/49999/50000/50001/importes grandes y decimales; mínimo inválido/no positivo; candidato NaN/Infinity/negativo; disabled/empty/missing; render real SSR de precios con/sin mayorista, aviso contextual, semántica de barra, estado full/compact y ahorro/success del dominio. Sin nueva dependencia de testing. npm run lint y npm run build: OK.

Edge headless con fixtures HTTP locales y SDK Meta interceptado: 42 casos en 320/375/768/1024/1440/1920. Por ancho: grilla con mayorista/solo minorista/nombre largo/con y sin descripción en datos, ficha con descripción conservada y ficha solo minorista sin contradicción, carrito minorista 40% con checkout habilitado y Side Cart compacto, mínimo exacto 100% con ahorro, superior acotado y regreso a 60%, y missing wholesale sin progreso/checkout retail correcto.

Grilla: precios/badges/final de acciones en la misma fila alineados dentro de 1 px en fixtures, incluidos encargos con una sola acción. Sin overflow horizontal. Accesibilidad conserva el nombre completo del producto aunque el título visible se limite a dos líneas. Datos fuente sin alteraciones. Escenarios extra: empty, disabled, mínimo cero sin división inválida y sin modificar el nivel, importes largos en carrito/preview en seis anchos. Cambios de cantidad no agregan requests. InitiateCheckout retail conserva importe efectivo; no Purchase ni errores de página. No se repitió la recepción real en Meta o la matriz completa histórica del MVP.

Capturas de grilla desktop y Side Cart mobile inspeccionadas. Evidencia en el directorio local ya documentado: wholesale-visual-qa.cjs, wholesale-visual-results.json, wholesale-visual-cards-375/1440.png, wholesale-visual-side-375/1440.png y wholesale-visual-summary-375/1440.png. QA en desarrollo local, no despliegue ni prueba física. No se midió CLS ni se garantiza alineación idéntica ante cualquier longitud arbitraria de moneda; se permite wrapping seguro.

### Comportamiento preservado y componentes
Modificados: ProductPrices (incluye WholesaleNotice), ProductCard, ProductDetail, CartPricingStatus y CartPreview. Agregados: helper visual y pruebas específicas. CartPage/CartSummary reciben la mejora a través de CartPricingStatus existente.

Sin cambios en Cart/domain/pricing.ts, cálculo económico/candidato/mínimo/transición/ahorro/faltante, API/contratos, Cart v4/migración/store, revalidación, WhatsApp, Meta, SEO, encargos 30/70, consentimiento o transiciones de ruta. Confirmado mediante diff de los archivos protegidos. No se agrega carrito mixto de precios ni bloqueo por mínimo.

### Performance
Build baseline ejecutado antes de editar: JS inicial agregado 611.18 kB / gzip194.86, CSS45.19 / gzip8.68, 453 módulos. Build final: principal299.07/gzip94.26, runtime102.27/34.06, whatsapp-url92.15/27.01, contenido5.79/2.08 y ProductCommerceActions113.28/37.89: JS inicial agregado612.56/gzip195.30 (+1.38/+0.44 kB), CSS45.74/gzip8.74 (+0.55/+0.06), 454 módulos. Sin dependencias, lockfile, configuración o umbral de chunks nuevos. No se midieron Core Web Vitals.

### Recomendación operativa y pendientes
Si mayorista está habilitado, se recomienda que cada producto público in_stock agregable al carrito tenga priceSale y priceWholesale válidos. priceWholesale null debería representar una excepción comercial deliberada. Es recomendación operativa; no se endurecen schemas ni se modifica Cajora o su DB.

Revisión/promoción manual a qa y posterior master según el usuario; comprobación en producción y dispositivos reales pendiente. Políticas jurídicas, reconocimiento de Customer existente por operador y mecanismos legales reales conservan sus pendientes anteriores. No hay bloqueos de implementación conocidos.

## F10.3 Cart UX Clarity (2026-11-06)

### Implementación
Ajuste de presentación realizado en dev según la autorización previa del usuario: qa es la referencia que revisa en ChatGPT web y la promoción sigue siendo manual dev → qa → master. Árbol inicialmente limpio. No se cambió de rama ni se escribieron commits.

CartSummary muestra primero cantidad, estado y el importe efectivo, con label «Total actual» en RETAIL. El bloque de «Acceso mayorista» se separa mediante borde/espacio y etiqueta la cifra como «Progreso mayorista», con candidato / mínimo, barra, faltante y explicación: «El progreso se calcula usando los precios mayoristas de los productos de tu carrito.» No se introducen términos de implementación en el copy visible.

CartPreview presenta el mismo orden, con «Calculado con precios mayoristas.» y faltante compacto. WHOLESALE usa «✓ Precio mayorista desbloqueado», total mayorista, ahorro y barra 100%; no repite el cociente o explicación larga. Missing wholesale conserva el total actual visible y aviso de productos solo minoristas, sin barra/faltante. Disabled conserva retail sin bloque de acceso o explicación mayorista. Aclaración de cliente mayorista existente conservada.

Componentes fuente modificados exclusivamente: CartSummary.tsx, CartPricingStatus.tsx y CartPreview.tsx. CartPricingStatus mantiene el beneficio/progreso/ahorro y comparte un pequeño CartPricingLabel dentro del mismo archivo; el total sigue siendo responsabilidad de Summary/Preview. Sin nueva capa, store o estado.

### Comportamiento preservado
No se modificaron pricing.ts ni wholesale-progress.ts: misma base mayorista, porcentaje, límite 100%, mínimo, faltante, transición y ahorro. El importe mostrado sigue siendo effectiveSubtotal. Checkout minorista y mayorista conserva sus gates; stock, quantity, v4, migración, revalidación, API, ProductPrices/Card/Detail, mensajes WhatsApp, Meta, SEO, encargos y Hero sin cambios. Comprobado con diff de los archivos protegidos; no se alteran cálculos ni se crean pedidos/pagos.

### Accesibilidad
Se conserva un único aria-live polite por contenedor de resumen/preview; ningún anuncio adicional en barra/total/faltante. role progressbar y aria-valuemin/max/now intactos; aria-valuetext retail agrega «en valor mayorista», y WHOLESALE conserva «Mínimo mayorista alcanzado». Orden visual/DOM: beneficio y total antes del incentivo según estado. Semántica dl/dt/dd para total del resumen. Reduced motion y foco al cerrar Side Cart comprobados; no se ejecutó lector de pantalla físico.

### Pruebas
92 pruebas pasan: 88 existentes con ajustes de copy/ubicación de los asserts de estado y cuatro casos nuevos. Se conservan assertions de fórmula, límites, dinero, almacenamiento, WhatsApp, Meta y SEO. Nuevos renders SSR prueban la jerarquía completa del resumen y preview, explicación full/compact, estado mayorista y missing/disabled, y un único contenedor polite.

Fixture concreto con dos unidades: A priceSale 7000 / priceWholesale 4680; B priceSale 1950 / priceWholesale 1690; mínimo 50000. Resultado sin cambios: total actual 8950, progreso mayorista 6370, faltante 43630 y barra 12.74%. Se comprueba que 8950 aparece antes del acceso/progreso y que el cociente usa 6370, no el total actual. npm run lint y npm run build: OK.

### QA responsive y visual
Edge headless con API local de fixtures y SDK Meta interceptado. 48 casos: CartSummary y Side Cart, en RETAIL/WHOLESALE/missing/disabled, para 320/375/768/1024/1440/1920. Sin overflow horizontal ni errores de página. Caso concreto de 8950/6370/43630 verificado en ambos contenedores; labels, cociente, faltante, explicación y orden geométrico comprobados.

Mayorista de fixture: cantidades 10×A + 2×B, total efectivo 50180 y ahorro 23720, barra 100%. El total precede ahorro/barra y no se muestra el cociente. Checkout habilitado mantiene mensajes por nivel y valores Meta 8950/50180 al hacer clic; no se emitió Purchase. Missing conserva total 12000 sin barra; disabled conserva 8950 sin incentivo. Importes largos adicionales en ambos contenedores en los seis anchos, con wrapping seguro. Reduced motion sin transición y Escape devuelve foco al acceso del carrito.

Capturas de resumen retail mobile, preview retail mobile y resumen wholesale desktop inspeccionadas visualmente. Evidencia local en el directorio ya documentado: cart-clarity-qa.cjs, cart-clarity-results.json, cart-clarity-summary-retail-375/1440.png, cart-clarity-summary-wholesale-375/1440.png, cart-clarity-side-retail-375/1440.png y cart-clarity-side-wholesale-375/1440.png. No se afirma validación de producción ni dispositivos físicos.

### Dependencias y límites
Sin dependencias nuevas, cambios de lockfile o configuración. Build local final: JS inicial agregado 613.34/gzip195.46 kB (principal299.07/94.27, runtime102.27/34.06, whatsapp-url92.15/27.01, contenido5.79/2.08 y ProductCommerceActions114.06/38.04); CSS45.94/gzip8.77. Comparación con snapshot documentado del Visual Polish: +0.78/+0.16 kB JS y +0.20/+0.03 CSS. No se ejecutó un build nuevo del checkout anterior en esta tarea. Sin mediciones de CWV o dictamen de accesibilidad.

Revisión/promoción manual y pendientes productivos de fases anteriores conservados. Sin bloqueos de implementación conocidos; el único cambio respecto de la rama nombrada por el documento es usar dev conforme al acuerdo vigente del usuario.

## Wholesale information architecture / FAQ — 2026-11-07

Ajuste de presentación/contenido F10.3 realizado en dev, según autorización vigente del usuario; qa sigue siendo referencia de revisión y promoción manual. No constituye fase de negocio nueva. Árbol inicialmente limpio, sin cambios de rama ni operaciones Git de escritura.

### Información por superficie
WholesaleNotice conserva el nombre/export existente pero queda como aviso global exclusivo de CatalogPage: «Mayorista desde {minimum} en valor mayorista · Podés combinar categorías.» El importe usa wholesaleMinimumAmount y formatCurrency existentes. Link discreto y navegable «¿Cómo funciona?» a /preguntas-frecuentes, con foco visible y área táctil; sin modal ni dependencia nueva. Disabled/loading conserva ausencia segura del aviso. No fue necesario modificar CatalogPage ni su fix de scroll.

HomePage elimina la llamada/import de WholesaleNotice. ProductDetail elimina aviso/import, tanto del caso con mayorista como del caso solo minorista; no sustituye el aviso por otro párrafo. ProductPrices conserva su presentación de precios y Solo minorista. Disponibilidad, descripción, acciones, nota de Cajora y aviso 30% de encargos intactos. No se modifican cards, Hero ni relacionados.

FAQ centralizada agrega el grupo «Compras minoristas y mayoristas» al mismo nivel que «Compras por encargo», reutilizando FaqEntry/FaqList sin cambiar su renderer. Seis preguntas: diferencia entre precios, acceso al mayorista, cálculo del mínimo, compra debajo del mínimo, Solo minorista y cliente mayorista existente. Copy sin cifras fijas o términos de implementación, con referencia a categorías combinables y reconocimiento por operador vía WhatsApp. Intro de FaqPage ampliada. Grupo de encargos de cuatro preguntas, política 30/70 y selección contextual de ficha conservados.

HomeBuyingGuide mantiene su reutilización previa del listado FAQ centralizado: el nuevo grupo también está disponible allí, cerrado inicialmente, dentro de su sección de ayuda existente; no se crea un aviso comercial adicional ni se copia el contenido. La ficha no incorpora las seis preguntas.

### Pruebas y accesibilidad
103 pruebas pasan: 98 previas adaptando la expectativa del aviso y el número de grupos, más cinco casos nuevos. Se conservan asserts de encargos, preguntas únicas, precios, Solo minorista, disabled, carrito, cálculo, WhatsApp, Meta y SEO. Renders reales de ProductDetail cubren ausencia de copy global/redundante y preservación de precios, descripción y acciones; composición Home/Catalog confirma ubicación única del aviso. Pruebas de FAQ verifican las seis preguntas exactas, grupo de encargos intacto, ausencia de monto/jerga, jerarquía nativa cerrada e introducción. npm run lint y npm run build: OK.

El aviso reutiliza Link de React Router; FAQ conserva details/summary anidados, sin controles dentro de summary, sin animación ni biblioteca nueva. Teclado, foco visible y apertura de las seis subpreguntas comprobados en navegador. Sin reader/dispositivo físico.

### QA responsive
Edge headless con API local simulada: 36 casos en 320/375/768/1024/1440/1920. Por ancho: Home sin aviso global; catálogo con aviso único; ficha con mayorista, ficha solo minorista y ficha por encargo sin aviso; FAQ con seis preguntas y grupo de encargos conservado. Sin overflow ni errores de página. Distancia entre bloque de precios y badge revisada sin espacio sobrante de un aviso retirado; descripción/acciones presentes. No se afirma CLS medido.

Nuevo grupo cerrado por defecto, seis hijos cerrados hasta activarlos, apertura de todos mediante Enter y cero controles anidados en summary. Total de 18 details (ocho entradas principales, seis hijas mayoristas y cuatro de encargos). On_order conserva una pregunta contextual y aviso del 30%. Product JSON-LD mantiene precio retail en los tres casos de ficha.

Escenarios adicionales: cambio de mínimo del fixture a 76543 se refleja en catálogo sin cambios de código; link «¿Cómo funciona?» activado por teclado lleva a FAQ; wholesale disabled oculta aviso/link contextual. Capturas mobile de catálogo/ficha solo minorista/grupo FAQ inspeccionadas visualmente. Evidencia en el directorio local previamente documentado: wholesale-info-qa.cjs, wholesale-info-results.json, wholesale-info-catalog-375/1440.png, wholesale-info-detail-375/1440.png, wholesale-info-faq-375/1440.png. QA local, no producción.

### Alcance preservado
Únicos fuentes modificados: ProductPrices.tsx (solo WholesaleNotice/import Link), ProductDetail.tsx, HomePage.tsx, storefront-content.ts y FaqPage.tsx. ProductPrices como bloque de precios, Cart v4/cálculos/mínimo/política, revalidación/checkout, API/contratos, WhatsApp, Meta, SEO, encargos y paginación/scroll no se modificaron. Confirmado con diff de archivos protegidos. No se añaden lookup de Customer, login, pagos o nuevas llamadas API. Sin dependencias/lockfile nuevos.

Revisión/promoción manual a qa y comprobación productiva pendientes según workflow del usuario. Se mantienen los límites operativos/jurídicos ya documentados. Sin bloqueos de implementación conocidos; se usa dev conforme al acuerdo del usuario aunque el documento de referencia nombre qa.

## Fix Agotado + FAQ wholesale deep link auto-open — 2026-11-07

### Disponibilidad
Los helpers catalog-availability.ts y Cart/domain/cart.ts cambian exclusivamente la etiqueta out_of_stock de No disponible a Agotado. Disponible y Por encargo permanecen iguales. Sin cambios en stock, saleMode, eligibility, cantidades o gates; availabilityStatus sigue siendo la única fuente del label. Se conserva Consultar disponibilidad para agotado y el texto secundario neutral de ficha, sin promesas de reposición. El único cambio de Cart es ese literal en getCartAvailabilityLabel.

### Deep link
WHOLESALE_FAQ_ID es una constante explícita de contenido: compras-minoristas-y-mayoristas. No se genera desde el título. Solo el grupo mayorista declara ese ID; FaqEntry admite id opcional y FaqList lo emite en details con scroll-mt-6. WholesaleNotice reutiliza el ID en /preguntas-frecuentes#compras-minoristas-y-mayoristas, conservando importe dinámico, copy y estilos.

FaqPage observa hash/location key, valida contra IDs declarados y busca un HTMLDetailsElement dentro de su propio contenedor. En el siguiente frame abre el padre mediante la propiedad nativa open y hace scrollIntoView auto/start, después del foco/restauración de ruta existentes. Cleanup cancela callbacks pendientes. No controla todos los details, no agrega foco ni abre hijos. Render normal sin hash y hash desconocido no generan apertura/scroll desde el efecto. La URL con hash funciona en montaje directo, recarga, navegación SPA y cambios de hash en la misma página. Cierre manual permanece estable ante rerenders sin navegación; una navegación explícita al destino puede reabrirlo.

### Validación
109 pruebas pasan (103 anteriores adaptando el href/label + cinco casos de deep link y uno de label de carrito). Tests de ID estable, allowlist, apertura solo padre, hijos/encargos cerrados, entrada directa, hash inválido, navegación con mismo hash, cierre nativo, target ausente/fuera de ámbito y cancelación de frame. Los tests de lifecycle ejecutan FaqPage real con hooks/DOM controlados, y el comportamiento nativo se comprueba adicionalmente en navegador. Asserts de pricing, almacenamiento, API, WhatsApp, Meta y SEO conservados. npm run lint y npm run build: OK.

Edge headless con fixtures locales: 36 casos en 320/375/768/1024/1440/1920. Por ancho: card agotada incluso con stock físico 20, click del catálogo hacia FAQ abierta/visible, entrada directa y refresh con hash, FAQ sin hash/inválido cerrada, ficha agotada con Consultar disponibilidad y sin agregar, ficha por encargo con stock físico 0 que mantiene Por encargo/30%/Consultar y encargar. Sin overflow ni errores de página; header no tapa el summary. Solo padre abierto, seis hijos cerrados y encargos cerrado. SEO mantiene OutOfStock en ficha agotada y availability omitida en encargo.

Regresiones adicionales a 375 px: Back/Forward catálogo → FAQ → catálogo → FAQ; cierre manual no se revierte al abrir/cerrar Side Cart; cambio de hash dentro de FAQ; revalidación de snapshot in_stock a agotado, label Agotado en CartPage/Side Cart y checkout bloqueado; reduced motion conserva llegada auto y transición de ruta desactivada según preferencia. Sin apertura/envío de WhatsApp ni SDK Meta productivo.

Capturas finales tomadas después de F18 e inspeccionadas visualmente. Evidencia local en el directorio ya documentado: agotado-faq-qa.cjs, agotado-faq-results.json, agotado-faq-deep-375.png, agotado-faq-deep-1440.png y agotado-faq-captures.cjs. Pruebas con fixtures, no despliegue productivo ni lectores/dispositivos físicos.

### Alcance preservado
Pricing/mínimo/candidato/transición/ahorro/faltante, Cart v4/migración/revalidación/checkout, API/backend, WhatsApp, Meta, SEO, FAQ/copy de encargos, política 30/70 y F18 intactos. Sin nuevas dependencias, estado global, librería de acordeón o modificación del hash canónico SEO. El copy mayorista aprobado no cambia; solo se agrega su ID.

Se mantiene dev como rama de implementación conforme al acuerdo vigente del usuario, con revisión/promoción manual a qa. No se cambió de rama ni se escribieron operaciones Git. Pendientes de producción y fases anteriores conservados; sin bloqueos conocidos.
