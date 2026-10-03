# F11 — Storefront visual / merchandising UX

Fecha: 2026-10-03. Implementación sobre dev. QA con fixtures HTTP locales; ningún mensaje WhatsApp enviado ni operación comercial real.

## Implementado

- Announcement bar estática; Header neutral con estado activo y contador accesible de unidades. StoreRoute lee Cart y pasa props a StoreLayout/Header; shared no depende de features.
- Hero tipográfico con nombre/logo existente, fallback de logo y CTA al catálogo/ancla. Dos banners informativos, categorías por slug, tres pasos y FAQ nativa. Copy centralizado en src/content/storefront-content.ts.
- ProductCard con un enlace informativo y acciones hermanas. Badge textual de los tres estados; secundaria montada al entrar mouse/pen, decorativa y retirada ante error.
- Detalle con breadcrumbs, panel comercial/availabilityNote, microcopy según estado y galería vertical desktop/horizontal mobile. Rich content semántico con medida de lectura y specs en dl.
- Búsqueda/filtros, filas/resumen del carrito y Footer con superficies neutrales coherentes. Sin sticky en Header o resumen; sin carousel ni assets nuevos de marketing.
- Rutas de catálogo y detalle cargadas de forma diferida mediante lazy de React Router, con HydrateFallback inicial para mantener el chunk principal bajo el aviso de Vite. Slug, fetching, estados y composición de acciones preservados.

## Automated

Desde client:

```text
node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs
39 passed / 0 failed (catalog 17, cart 16, WhatsApp 6)
npm run lint: OK
npm run build: OK, sin warnings
```

Sin nuevas dependencias ni tests que comprueben clases CSS. Se conservan las suites de dominio/contratos existentes; el nuevo comportamiento de pointer y layout se verificó en navegador.

## Visual / manual

Edge headless con Playwright del runtime disponible y un contexto aislado, servido por Vite en localhost. API HTTP de fixtures en otro puerto; imágenes SVG neutras solo de prueba, fuera del repositorio. La herramienta CUA no pudo iniciar (error de assets del kernel); se usó esta alternativa sin instalar dependencias del proyecto.

Se revisaron capturas de Home desktop/mobile, detalle mobile y carrito desktop. La matriz y las interacciones se comprobaron mediante controles reales del navegador y lectura del DOM. Se verificaron:

- Negocio con logo válido, null y URL rota: el nombre permanece y la imagen fallida desaparece.
- Home success/loading/error/vacía conserva hero y guía; productos/categorías vacíos mantienen estados existentes.
- Disponible, no disponible y por encargo (con stock físico 20): badges textuales y acciones originales; agotado/encargo sin botón de agregar.
- Nombre y descripción extensos, producto sin imagen, nota larga de encargo, rich content con h2/h3, párrafo, listas bullet/numbered y specs.
- Galería con portada y varias imágenes; selección actual con aria-pressed. Producto con solo portada y producto sin imágenes no generan tira de miniaturas.
- Búsqueda, contador 2 unidades después de incrementar, FAQ nativa y ancla #como-comprar.
- Carrito vacío y con items; stock 4→1 mantiene quantity 3, muestra aviso y bloquea consulta. Agotado/encargo bloquean; error muestra retry; retry exitoso habilita enlace.
- Durante carga de revalidación el botón permanece deshabilitado. Cambio de quantity: cero requests de detalle nuevas. URL WhatsApp inspeccionada sin abrirla.

## Responsive

| Ruta | 320 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| / | OK | OK | OK | OK | OK |
| /productos | OK | OK | OK | OK | OK |
| /productos?categoria=objetos-diarios | OK | OK | OK | OK | OK |
| /productos/producto-disponible | OK | OK | OK | OK | OK |
| /carrito vacío | OK | OK | OK | OK | OK |
| /carrito con items | OK | OK | OK | OK | OK |

OK significa scrollWidth sin superar innerWidth. Las cinco rutas principales tienen un h1 y cero controles interactivos anidados. Detalles agotado/encargo con nota larga también comprobados en 375 px. Miniaturas: flex-direction column a 1440 y row a 375; scroll propio sin overflow de página.

## Accessibility

- Skip link alcanza main-content; navegación por pathname enfoca main. Búsqueda mantiene label y formulario; filtros usan links por slug y aria-current.
- Un enlace informativo por card, foco visible dentro del borde para evitar clipping, acciones externas. Header anuncia “Carrito, N unidades”; badge visual decorativo.
- Breadcrumb nav con aria-label y página actual; status con texto además de indicador decorativo. Note/rich content son texto, nunca HTML arbitrario.
- FAQ se abre con click y se cierra con Enter; galería seleccionable por Enter y aria-pressed actualizado. Miniaturas internas decorativas y alt de imagen principal preservados.
- Reduced-motion medido: transición secundaria 0s. Touch emulado a 375: tap navega al slug sin requests de secundaria. No equivale a validación en un dispositivo físico.
- Tokens neutrales y foco existente conservados. No se ejecutó una auditoría WCAG completa ni lector de pantalla real.

## Performance

Build final Vite:

| Asset | Minificado | Gzip |
| --- | --- | --- |
| JS principal | 498.90 kB | 155.36 kB |
| ProductDetailPage diferido | 0.70 kB | 0.39 kB |
| CatalogPage diferido | 1.47 kB | 0.72 kB |
| CSS | 35.52 kB | 6.79 kB |

Sin fuentes, icon packs, imágenes hero, carousel o dependencias nuevas. La mejora de división es pequeña porque componentes de catálogo comparten el barrel; el principal permanece cerca del umbral de 500 kB y debe vigilarse en próximas fases. No se cambia el umbral para esconder avisos.

Secundaria: cero imágenes montadas inicialmente, una tras hover válido y retirada si falla. La portada conserva lazy en cards y eager en detalle; no se consulta detalle por card ni se duplican requests por cantidad. Sin Lighthouse ni mediciones de Core Web Vitals de producción.

## Observaciones

Primer recorrido detectó un selector QA demasiado estricto para el enlace WhatsApp, cuyo nombre accesible incluye “abre en una nueva pestaña”; se corrigió el selector. Un recorrido de teclado ejecutado antes de completar la carga no midió el skip link; el recorrido dedicado, esperando la UI, confirmó skip y foco de rutas. Estos fallos fueron del harness, no cambios del contrato comercial.

F10A/F10B conservan schemas, dominio, persistencia v3, servicios y condiciones de gate. Ningún cambio de stock/status, precio o quantity se añadió por motivos visuales. La ilustración geométrica es decorativa, y los banners describen únicamente el flujo soportado.

Se corrigió el aviso de React Router en entradas directas a rutas diferidas mediante HydrateFallback. El recorrido final de las cinco rutas no registró pageerrors ni ese aviso.

## Known limitations

Pendientes previos: smoke test Cajora/hosting real, CORS y fallback SPA reales, auditoría de vulnerabilidades F8. También touch físico, lector de pantalla real y branding definitivo. F11 no declara producción lista ni reserva stock.

## Next

Validar en dispositivos reales y con identidad visual definitiva; completar pendientes de producción cuando exista un entorno desplegado. Mantener el presupuesto de bundle y revisar división adicional si próximas funciones lo requieren.
