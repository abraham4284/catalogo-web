# Technical QA — F8

Nota F9: este informe conserva el QA histórico del baseline anterior (contrato previo y carrito v1). El contrato comercial, persistencia v2 y sus validaciones actuales se documentan en `docs/f9-validation.md`; los tamaños/conteos F8 no representan el build vigente.

## Scope
QA técnico PASS para deployment/pruebas reales; no certifica producción. Revisado el 2026-10-01 sobre `dev`, base `057a1f2` más cambios locales F8 (sin commit automático).

Revisión completa de `client/src`, pruebas, configuración Vite/TypeScript/ESLint/shadcn, HTML, entorno público, ignore, dependencias, README y documentación canónica. No se inspeccionaron archivos generados. No hay proveedor de hosting configurado.

Fronteras verificadas: Axios solo en infraestructura/API; pages componen barrels; catalog/cart/whatsapp independientes; shared no importa features. TypeScript estricto, sin `any` en src. La aserción de root en main corresponde al elemento definido en index.html. Inputs/DTOs se validan con Zod y mensajes externos se presentan como texto React, sin HTML/eval. No se encontraron credenciales, Authorization ni Bearer en código de aplicación; la referencia Authorization en tests comprueba su ausencia. Imágenes usan exclusivamente src; navegación y WhatsApp construyen destinos propios.

Revisión de efectos: Home paralelo; categorías al montar listado, productos por query; AbortSignal y guards impiden publicar respuestas canceladas; detalle se remonta por ID. Filtros/IDs rechazan enteros inválidos/inseguros, búsqueda trim y límite 150, navegación conserva filtros y página fuera de rango usa replace. Galería ordena una copia, deduplica y conserva portada/fallback/alt. Persistencia valida versión, duplicados y snapshots, limita cantidades y deriva totales. WhatsApp valida 8–15 dígitos, codifica un único parámetro text, usa noopener/noreferrer y conserva carrito.

Dependencias: imports de runtime/UI y tooling/CSS corresponden a paquetes existentes. Phosphor se mantiene como biblioteca de iconos declarada por shadcn; no se agregó ni actualizó ningún paquete. Sin advertencia de tamaño que justifique code splitting.

## Automated validation
Desde `client/`:

| Validación | Resultado |
| --- | --- |
| `node --test tests/catalog.test.cjs` | 12 PASS |
| `node --test tests/cart.test.cjs` | 8 PASS |
| `node --test tests/whatsapp.test.cjs` | 4 PASS |
| Ejecución conjunta de las tres suites | 24 PASS, 0 fallos |
| `npm run lint` | PASS |
| `npm run build` | PASS, sin warnings |
| `npm audit --omit=dev` | No verificado: falló el acceso al endpoint de auditoría; no se ejecutó audit fix |

Build: JS 480.34 kB / gzip 149.54 kB; CSS 28.66 kB / gzip 5.67 kB. Son tamaños de artefacto, no mediciones de velocidad/Lighthouse. Pruebas sin red con módulos reales, adaptador Axios y store Zustand; no se añadió un framework DOM.

## Manual verification
Navegador local sobre Vite, con API y contacto explícitamente vacíos. `/`, `/productos`, `/productos/1`, `/carrito`, `/ruta-inexistente` inspeccionadas en 320/375/768/1024/1440 px: 25 combinaciones sin overflow horizontal, con un h1 y estados seguros de error/carrito vacío/Not Found. Screenshot de catálogo a 320 px revisado visualmente.

Comprobados: navegación por enlace lleva foco a main; submit de búsqueda trim con caracteres especiales mantiene foco del botón; limpiar búsqueda vacía input; skip link mediante Enter enfoca main. `/productos/abc` muestra producto no disponible también tras refresh. Logs de navegador consultados: sin errores/warnings. Overrides de viewport restaurados y servidor detenido tras la revisión.

No hubo validación visual de productos/galería/carrito lleno con backend real. Contacto ausente, enlace codificado y persistencia se verifican en pruebas/estructura, no mediante una compra o envío. El 404 de cuerpo no estándar se valida en la frontera y su tratamiento en el hook por revisión; no mediante backend real.

## Fixed during F8
- URL de configuración malformada: safeParse podía lanzar TypeError desde new URL; ahora devuelve el error seguro previsto. Regresión reproducida antes del fix y PASS después.
- Detalle: HTTP 404 con body ajeno al contrato conserva statusCode y ahora presenta producto no disponible.
- Foco: token ring neutral pasó de luminancia aproximada 0.355 (contraste 2.59:1 sobre blanco) a 0.172 (4.73:1), superando 3:1 para los outlines de controles.
- Prueba real de escritura con almacenamiento lleno; se mantiene carrito hidratado y acciones en memoria.
- README actualizado al MVP y requisito de fallback SPA documentado.

## Known limitations
Sin smoke test contra Cajora ni hosting final; quedan pendientes CORS, contrato real y assets servidos por backend. Sin auditoría de vulnerabilidades concluyente ni medición de performance con red/dispositivo reales. Accesibilidad revisada por estructura y teclado, sin evaluación exhaustiva con lector de pantalla.

Snapshots locales no garantizan precios/disponibilidad ni reservan stock. No hay login, pagos, órdenes backend, analytics, branding definitivo ni blog. El handoff termina en WhatsApp y la venta se registra manualmente en Cajora; son límites del MVP.

## Deployment checklist
- [ ] Build con `VITE_CATALOG_API_URL=<backend>/api/public` y `VITE_WHATSAPP_NUMBER=<internacional, 8–15 dígitos>`. Variables públicas, sin secretos.
- [ ] Cajora: confirmar `PUBLIC_CATALOG_BUSINESS_SLUG` y CORS mediante `STOREFRONT_URL` del frontend.
- [ ] Publicar `client/dist/` con HTTPS y assets accesibles.
- [ ] Hosting: fallback de rutas SPA a `/index.html`, sin sustituir archivos estáticos existentes. Obligatorio para createBrowserRouter; el servidor Vite local no prueba el hosting final.
- [ ] Postdeployment: Home, apertura directa de catálogo, refresh de detalle, búsqueda/categoría/paginación, agregar producto y refrescar carrito, inspeccionar href WhatsApp sin envío automático y ruta 404.
- [ ] Reintentar auditoría de dependencias cuando el registry esté disponible.

## Release blockers
No se identificaron bloqueos de código para iniciar deployment/pruebas reales. Publicación operativa requiere completar configuración/hosting y smoke test anteriores; no afirmar producción lista hasta verificarlos.

## Catalog pagination scroll restoration — 2026-11-07

Fix puntual implementado en dev según el acuerdo vigente del usuario: qa es referencia de revisión, con promoción manual dev → qa → master. Árbol inicialmente limpio; sin cambio de rama, sincronización o escritura Git. La evidencia anterior de este informe conserva su contexto histórico.

### Implementación
Único archivo fuente modificado: client/src/pages/catalog/CatalogPage.tsx. Wrapper/ref estable antes de loading/error/success y paginación; estado anterior de page en ref y efecto dependiente solo de filters.page. Al cambiar página, scrollIntoView con behavior auto y block start sobre el inicio de resultados, sin foco explícito.

Se ejecuta en el siguiente frame mediante requestAnimationFrame local. La prueba de historial mostró que el scroll síncrono del efecto podía ser sobrescrito por la restauración nativa del navegador; el frame corrige ese orden. No espera success ni agrega una animación o temporizador de espera. Cleanup cancela un frame pendiente al cambiar de página o desmontar; cambios rápidos solo conservan el último.

No se dispara en montaje inicial, incluida vuelta desde ficha, ni por search/categoría si page no cambia, retry, loading/success o re-render del carrito. Un filtro que realmente resetea page a 1 sí dispara scroll. Se conservan Navigate replace de página fuera de rango, Links navegables e historial. No se usa ScrollToTop global, window.scrollTo, focus() nuevo ni key por search. StoreRoute, StoreLayout/F18, hooks/API, límites/filtros URL y mayorista/carrito permanecen sin modificaciones.

### Pruebas ejecutadas
Desde client: node --test tests/*.test.cjs, npm run lint y npm run build: OK. 98 pruebas pasan (92 existentes + seis nuevas), sin omitidas. La nueva suite ejecuta el componente real con URL/datos y ciclo de hooks controlados, registrando el DOM side effect sin dependencia DOM adicional. Cubre 1→2→3→2→1, misma página con filtros/retry/data, reset 3→1, montaje en páginas distintas, redirect inválido y cancelación de frames superados. La geometría e historial se verificaron adicionalmente en navegador real.

Edge headless con API de fixtures local: 72 productos, 24 por página y tres páginas; carga lenta de 1200 ms para confirmar scroll durante skeleton. 24 transiciones principales en 320/375/768/1024/1440/1920: 1→2→3→2→1. Se llega al final para pulsar los Links y se comprueba el inicio del área y el primer producto correcto de la página nueva, tanto durante carga como después. Una llamada local por cambio, sin smooth ni llamadas al focus del componente. Sin overflow ni errores de página. Identidad DOM de route-enter y wrapper de resultados conservada entre queries.

Regresiones adicionales en 375 px: query Back/Forward al inicio de resultados; vuelta desde ficha sin llamada adicional de paginación (sin afirmar una nueva política de restauración global); search/categoría en page 1 sin llamada; filtros desde page 3 resetean y desplazan una vez; error/retry/empty sin scroll innecesario; page 99 redirige con replace a page 3 y desplaza; agregar/ajustar cantidad y abrir/cerrar Side Cart no disparan scroll. Reduced motion conserva auto y la ausencia de transición de F18.

Captura mobile del inicio de página 2 inspeccionada; 375 y 1440 capturados. Evidencia local en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/: catalog-pagination-scroll-qa.cjs, catalog-pagination-scroll-results.json, catalog-scroll-375.png y catalog-scroll-1440.png. Matriz y regresiones completadas en recorridos locales consecutivos. Sin producción, dispositivos físicos ni lector de pantalla probados.

Sin dependencias, API o reglas comerciales nuevas. El único ajuste respecto de la recomendación conceptual del documento es usar el siguiente frame para respetar el orden del historial nativo. Pendientes de promoción/deploy y verificación real anteriores conservados; sin bloqueos de implementación conocidos.

## Visual polish — out_of_stock image badge — 2026-11-07

### Cambio y alcance
Dos componentes de producción: ProductCardImage agrega availabilityStatus con el tipo existente y cápsula AGOTADO solo para out_of_stock; ProductCard pasa ese estado y omite el badge inferior únicamente en ese caso. Fondo bg-foreground (#242038), texto blanco, posición top/right 12 px, z-10 sobre ambas imágenes y pointer-events-none. No filtros ni opacidad de foto. Texto visible accesible sin aria-hidden. Un contenedor min-h-7 preserva altura bajo precios sin texto falso. El Link y sus acciones hermanas mantienen estructura/foco.

ProductAvailabilityBadge/helper, ProductDetail, cart/domain, WhatsApp/CTA, pricing, FAQ/deep link, paginación, API/contratos de Cajora, SEO y Meta sin modificaciones. Disponible y Por encargo permanecen debajo de precios; ficha conserva Agotado normal. Sin nuevas dependencias, fetching o estado de negocio. Se implementa sobre dev según el acuerdo vigente del usuario y AGENTS.md; la rama qa del documento adjunto es su referencia de revisión, con promoción manual.

### Verificación ejecutada
Desde client: node --test --test-reporter=dot tests/*.test.cjs (112 pruebas OK), npm run lint y npm run build: OK. Tres pruebas nuevas en wholesale-info.test.cjs: posición/no duplicación en tres estados (agotado con stock físico 20 y encargo con 0), badge con/sin imagen conservando fallback y estado textual de ficha intacto. Hover se verifica en navegador, no mediante el render estático.

Edge headless + Vite y fixtures locales: 320/375/768/1024/1440/1920 px con los tres estados en la misma grilla. Badge único dentro de imagen, color de marca/blanco, sin truncado, margen y tamaño contenidos; no overflow. Títulos/precios/inicio y final de bloques de acciones alineados en filas compartidas. Consultar disponibilidad permanece visible sin Agregar al carrito en agotado; Por encargo con stock 0 mantiene Consultar y encargar. La imagen conserva opacity 1 y filter none.

Hover real en 768/1024/1440/1920 monta secundaria y lleva su opacity a 1; badge continúa visible sobre ella sin interceptar el enlace. Contextos touch emulados en 320/375 muestran badge sin hover ni cargar secundaria; tap navega a la ficha que conserva Agotado normal, sin badge de imagen. A 1440 se comprueba foco visible del enlace y navegación con Enter. Sin errores de página. Capturas completas 375/1440 inspeccionadas visualmente. Pruebas locales con imágenes SVG de fixture, no fotos productivas/dispositivos físicos/lector de pantalla.

Evidencia local en C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/: agotado-image-qa.cjs, agotado-image-results.json, agotado-image-375.png y agotado-image-1440.png. No se inició una nueva fase; pendientes de producción anteriores conservados.
