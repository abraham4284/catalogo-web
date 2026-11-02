# F20 — Meta Pixel + Consent + Event Tracking

Fecha: 2026-11-02. Rama dev, limpia al iniciar. Implementación técnica local; Meta Events Manager en producción queda pendiente.

## Implemented
Capa features/analytics para consentimiento, loader SDK, helpers tipados y banner. Una instancia AnalyticsConsent en StoreRoute; ProductAnalytics en composición app para fichas exitosas. Callbacks opcionales en controles existentes conectan acciones sin imports entre features ni modificación del dominio. Sin nuevas dependencias, backend, DB, CAPI, Purchase, GTM o Google Analytics.

## Consent behavior
Clave vitruno-analytics-consent-v1 con únicamente accepted/rejected. Ausencia/corrupción/storage inaccesible → unknown. Unknown y rejected no cargan fbevents.js ni despachan eventos. Preferencia se conserva entre recargas. Banner inferior no modal con dos acciones de igual jerarquía; Footer permite reabrir preferencias.

Al revocar: se persiste rejected, se bloquean wrappers, se llama consent revoke, se vacía cola SDK y se retira script; se recarga una vez si hubo inicialización para eliminar el SDK residente. Si storage falla, el próximo documento vuelve a unknown (sin SDK). No se promete eliminar cookies de dominios de terceros desde JavaScript. Se sincronizan cambios/clear de storage entre pestañas.

## Pixel initialization
VITE_META_PIXEL_ID opcional, formato numérico validado; vacío/incorrecto no carga ni rompe app. .env.example actualizado con valor documental 1149384361363794, sin editar archivos privados. Sin fallback de ID en código. SDK async tras aceptación, globals fbq/_fbq encapsulados y tipados, init una vez por documento. autoConfig=false antes de init y sin datos de usuario en init. Las llamadas son best effort/no-throw. Stub estándar con cola acotada a 100 llamadas; error de script detiene tracking hasta recargar. No es una cola de eventos backend.

## Event mapping / payloads
- PageView: una entrada por pathname, no por query; aceptar a mitad de sesión registra la página actual. Dedupe efímero por visita soporta rerenders/StrictMode. Salir y volver cuenta otra visita.
- ViewContent: ficha cargada exitosamente, id/nombre/precio reales; una vez por visita/producto. Al aceptar con ficha cargada genera PageView y ViewContent actuales. No se instrumentan loading/error/404.
- AddToCart: después del mismo before/after confirmado por F17, cantidad agregada 1, sin revalidar ni abrir panel.
- InitiateCheckout: callback solo en enlace WhatsApp válido dentro del branch de CartPage con verificación success y carrito coherente. No al entrar al carrito. Items/quantity/total del snapshot mostrado. No dispara Contact.
- Contact: producto con URL válida o formulario Zod válido con URL construida. El enlace explícito para reabrir WhatsApp cuenta una nueva acción. No se cuenta typing/focus/submit inválido.

Producto: content_ids, content_name, content_type=product, contents [{id,quantity:1}], value numérico y currency ARS. Checkout: content_ids, contents con cantidades, num_items, value y currency. Consulta de producto: source product_inquiry, IDs/nombre/status comercial; contacto general: solo source contact_page. No Purchase.

## PII policy
Los payloads propios usan selección explícita: no incluyen nombre del comprador, email, teléfono, mensaje, DNI, dirección, número WhatsApp ni URL del mensaje. Las funciones no reciben el objeto del formulario. No hay hashing/Advanced Matching manual. Se configura autoConfig=false para evitar configuración automática adicional; verificar también Automatic Advanced Matching y eventos remotos OFF en Meta Events Manager, fuera del repositorio. No utilizar Event Setup Tool para duplicar estos eventos.

El SDK de Meta puede procesar identificadores técnicos, cookies, URL y referrer al cargar/medir. Por eso “sin PII” aquí se refiere a campos de payload de la app, no a una garantía sobre todas las operaciones de un SDK externo. No introducir datos personales en URLs; la política pública de privacidad/cookies y revisión comercial/legal están pendientes. No se inventó ruta legal ni se afirma cumplimiento jurídico absoluto.

Referencia primaria consultada: [template oficial de Meta](https://github.com/facebook/GoogleTagManager-WebTemplate-For-FacebookPixel/blob/main/template.tpl), con referencias a consentimiento y autoConfig. No se instaló GTM ni se usó ese template como dependencia.

## Automated tests
node --test tests/*.test.cjs: 59 pasan, 0 fallos (54 existentes + 5 Analytics). Nuevos tests: unknown/rejected/config inválida, parser/persistencia, init/script idempotentes y PageView revisitas, dedupe ViewContent/payload explícito sin campos privados, totales de checkout y bloqueo al revocar.

npm run lint y npm run build: OK. Se mantiene aviso de chunk >500 kB. Sin modificaciones a robots/sitemap/SEO helpers, transición, prefetch o dominio persistido. No se agregan frameworks de DOM.

## Browser QA
Edge headless, fixtures locales y script SDK interceptado en el recorrido final; WhatsApp bloqueado/interceptado. No se verificó Meta real ni recepción en Events Manager.

Recorrido final: unknown → 0 cargas; rechazo persistido → 0 cargas; aceptación → una carga y PageView actual una vez. Home → catálogo → búsqueda (sin PageView adicional) → ficha (ViewContent una vez) → agregado (AddToCart una vez) → galería (sin duplicar ViewContent) → consulta (Contact) → carrito (sin checkout) → clic habilitado (InitiateCheckout, sin Contact extra). Formulario inválido sin evento, válido con Contact; payload capturado no contiene strings privados de los campos. Revocación persiste rejected, recarga y no vuelve a cargar SDK.

Pruebas adicionales: aceptar sobre ficha ya cargada produce PageView/ViewContent una vez; reload con aceptación persiste y mide la nueva entrada; SDK abortado no impide agregar/toast. Checkout loading/error/stale/out_of_stock/on_order deshabilitado sin InitiateCheckout. Los límites/rechazos de agregado mantienen la misma condición F17 cubierta por suites existentes, sin duplicar sus reglas. No se afirma prueba manual de cada combinación de rechazo en Meta real.

## Responsive QA
Banner en 320/375/768/1024/1440 sin overflow, ambas opciones visibles. Captura 375 revisada: texto legible, controles min-height 44 px y wrapping. Safe area por CSS. Sin animación, autofocus ni trap de foco; se conserva la navegación por teclado del documento. No se ejecutó lector de pantalla físico. Revisión de código confirma foco visible y callbacks Footer sin acoplar shared a Analytics.

## Performance
Referencia F19 documentada: JS inicial 584.97 kB / gzip 185.87 (principal + jsx-runtime), CSS 42.27 / 8.09. Build F20 actual: principal/JS inicial 588.61 / gzip 186.85 (runtime reagrupado en principal), CSS 42.81 / 8.20. Comparación orientativa con ese snapshot: +3.64 kB JS / +0.98 gzip y +0.54 CSS / +0.11 gzip. No se hizo build del checkout previo antes de editar; no atribuir variaciones de agrupación exclusivamente a un módulo. SDK remoto no incluido en estas cifras: se descarga solo tras consentimiento. Sin dependencia npm de Meta, ni modificación del umbral de 500 kB. Sin Core Web Vitals medidos.

## Production setup
1. Configurar VITE_META_PIXEL_ID=1149384361363794 en hosting y ejecutar nuevo build/deploy; VITE_* se resuelve al compilar.
2. Local sin esa variable: deshabilitado. Para QA preferir ID de prueba y bloqueo de dominios Meta; no usar el dataset productivo para pruebas habituales.
3. Validar dominio/consentimiento, ausencia de requests antes de aceptar/rechazar, carga única tras aceptar y revocación.
4. Publicar política real de privacidad/cookies revisada por su responsable. Revisar el tratamiento de URLs/referrers/identificadores del SDK.

## Meta Events Manager checklist — pendiente manual
- [ ] Abrir VITRUNO Pixel → Test Events con acceso real.
- [ ] Confirmar ID y Automatic Advanced Matching OFF; sin reglas remotas que dupliquen eventos.
- [ ] Confirmar PageView, ViewContent, AddToCart, InitiateCheckout y Contact con payloads correctos.
- [ ] Confirmar que no hay Purchase ni Contact sobre el mismo checkout.
- [ ] Rechazo/revocación sin tracking posterior, persistencia y consultas sin PII escrita.
- [ ] Pixel Helper opcional para detectar duplicados; no es dependencia.

## Known limitations
No se validó Events Manager/Pixel Helper ni recepción real de eventos; ad blockers y fallos de red pueden perder eventos (best effort, sin garantizar atribución). La revocación no puede deshacer eventos ya consentidos/enviados. AutoConfig/init no sustituyen la revisión de ajustes remotos ni una política jurídica. No se implementó CAPI ni una señal fiable de venta confirmada. Regresión de contratos/negocio cubierta por 54 tests existentes y recorridos focalizados; no se repitió la matriz SEO F19 completa ni todos los dispositivos reales en esta fase.

## Evidence
Directorio C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/:
- f20-qa.cjs, f20-results.json: recorrido final con SDK interceptado.
- f20-extra.cjs: aceptación sobre ficha, persistencia y ad blocker simulado.
- f20-gates.cjs: gates de checkout.
- f20-consent-375.png: banner revisado.
