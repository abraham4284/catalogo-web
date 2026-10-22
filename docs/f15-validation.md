# Validación F15 — Commercial Copy / Purchase Handoff

Fecha: 2026-10-21. Rama dev. Cambios de copy y documentación, sin modificación de lógica comercial.

## Implemented

- FAQ existente ampliada de cuatro a siete preguntas con las condiciones comerciales suministradas en F15.
- Cómo comprar conserva tres pasos: Explorá → Agregá o consultá → Finalizá por WhatsApp. El último explica verificación previa y coordinación posterior de pago, entrega y datos necesarios.
- CTA de carrito unificado a “Finalizar compra por WhatsApp” en enlace habilitado, botón por verificación bloqueada y botón por contacto no configurado.
- Microcopy habilitado: “Confirmamos por WhatsApp la entrega, el medio de pago y los datos necesarios para completar la compra.”
- Mensajes de loading/error/stale/retry y contacto ausente conservados. ProductInquiryLink mantiene Consultar ahora/Consultar disponibilidad/Consultar por encargo.

Solo tres archivos de implementación modificados: storefront-content.ts, WhatsAppCheckoutLink.tsx y CartPage.tsx. HomeBuyingGuide sigue renderizando las mismas estructuras nativas desde el contenido. Sin nuevas secciones FAQ, formularios, endpoints, dependencies o cambios de estilo.

## FAQ

Se conservan consultas, encargos, ausencia de reserva y verificación de precio/disponibilidad. Wording ajustado al handoff de compra sin cambiar su significado.

Nuevas condiciones comunicadas, aprobadas en el documento F15 aportado por el usuario:

- Envíos a todo el país; medio, costo y datos se coordinan antes de despachar. No se promete envío gratis ni transportista concreto.
- Tiempo según localidad y medio de envío; plazo estimado informado antes del despacho. Sin cantidad fija de horas/días.
- Transferencias bancarias, transferencias mediante billeteras virtuales y efectivo. Sin agregar tarjetas, cuotas, proveedores de pago o pasarelas.

El texto es el copy VITRUNO provisto/adaptado para la tarea; no se copió de terceros. No se implementó una política técnica de shipping ni integración de pagos.

## Purchase handoff

Flujo preservado: catálogo → carrito → verificación de precio/disponibilidad → WhatsApp → coordinación final. El nuevo label describe esa continuidad; no confirma automáticamente una compra ni reserva stock.

No cambios en useCartCatalogRevalidation, store/cart v3, stock, schemas, slugs, API, routing, URL building o mensaje estructural del carrito. El texto del mensaje sigue incluyendo cantidades, precios, subtotales, total estimado y solicitud de confirmación. No se pidió nombre/DNI/dirección/provincia/CP/teléfono ni se creó alta pública de customers. Los datos necesarios se coordinan después por WhatsApp.

Los tres labels de carrito se actualizaron; consultas individuales preservadas y comprobadas para los tres estados. El enlace real sigue siendo a wa.me con target blank y rel noopener noreferrer; casos bloqueados siguen como button disabled.

## Automated validation

Desde client:

```text
node --test tests/catalog.test.cjs tests/cart.test.cjs tests/whatsapp.test.cjs
39 passed / 0 failed: catálogo 17, carrito 16, WhatsApp 6
npm run lint: OK
npm run build: OK con aviso de tamaño de chunk
git diff --check: OK
```

Los tests existentes no fijaban los labels/copy modificados, por lo que no se cambiaron expectativas ni se agregaron tests que espejen textos. No se instaló framework DOM.

Build: JS principal 500.82 kB / gzip 156.10 kB; ProductDetailPage 0.70/0.39 kB; CatalogPage 1.47/0.72 kB; CSS 36.88/7.24 kB. Frente a F14, el nuevo copy aumenta JS principal 0.84 kB y supera el umbral de aviso de Vite de 500 kB. La compilación es exitosa. Se documenta el aviso sin alterar el umbral o ampliar esta fase a cambios de empaquetado/routing.

## Responsive

Edge headless, contexto aislado, Vite 127.0.0.1:5175 y fixtures HTTP 127.0.0.1:5176. No se modificaron .env, backend ni sesiones del usuario. Console Ninja necesitó conexión local fuera del sandbox para iniciar Vite; configuración del proyecto intacta.

| Caso | 320 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- | --- |
| Home: siete FAQ abiertas y tres pasos | OK | OK | OK | OK | OK |
| Carrito vacío | OK | OK | OK | OK | OK |
| Carrito habilitado y microcopy | OK | OK | OK | OK | OK |
| Carrito verificando | OK | OK | OK | OK | OK |
| Carrito con error/retry | OK | OK | OK | OK | OK |
| Carrito con cantidad stale | OK | OK | OK | OK | OK |
| Carrito agotado | OK | OK | OK | OK | OK |
| Carrito por encargo | OK | OK | OK | OK | OK |

OK: scrollWidth no supera innerWidth; CTA dentro del viewport en todos los estados. FAQ y CTA largos envuelven texto de forma natural sin cambiar estilos. 35 casos de carrito y cinco anchos de Home medidos. Capturas de FAQ abierta y carrito habilitado en 375/1440; FAQ y carrito mobile revisados visualmente.

Loading usa el label nuevo y mantiene “Verificando precio y disponibilidad…”. Error conserva mensaje y Reintentar verificación; retry exitoso vuelve a habilitar enlace. Stale preserva cantidad y aviso; agotado/encargo bloquean. Carrito vacío no muestra CTA final. Mensaje/href inspeccionados sin abrir WhatsApp ni enviar mensajes. Contexto de prueba limpiado desde Vaciar carrito; ningún pageerror.

## Accessibility

Siete details/summary nativos, sin componente JS alternativo. FAQ de pago se abrió/cerró con Enter. Se conservan foco, labels, aria-live y status existentes, targets y aviso accesible de apertura en nueva pestaña.

Enlace habilitado y botones deshabilitados comparten el mismo label comercial. No se agrega formulario personal: se comprobó ausencia de input/textarea/select/form dentro del carrito. Los controles de cantidad siguen siendo botones, sin recoger nuevos datos.

## Known limitations

QA local con fixtures, sin operación comercial real ni validación del deployment. Las condiciones comerciales provienen del alcance F15 aprobado; costos, transportista, plazo y datos concretos se coordinan posteriormente. No se declara un pedido confirmado o pago realizado desde la web.

Aviso de bundle principal superior a 500 kB pendiente de evaluar en una fase de performance. Persisten pendientes históricos: smoke Cajora/hosting real, CORS/fallback SPA reales, auditoría de vulnerabilidades F8, touch físico, lector de pantalla real y previews/cachés tras deployment. El copy no resuelve esos pendientes.
