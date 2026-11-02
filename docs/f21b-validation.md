# F21B — Encargos, FAQ agrupada y WhatsApp flotante

Fecha: 2026-11-02. Rama `dev`, árbol inicialmente limpio. Implementación frontend; sin operaciones de escritura Git.

## Alcance y decisiones

- Ficha `on_order`: conserva precio principal, badge, descripción, nota Cajora y CTA `Consultar y encargar`. Sustituye el bloque lavanda y desglose en pesos por el aviso aprobado: «Para confirmar tu encargo se solicita un anticipo del 30% del valor total. Antes de abonar, confirmamos precio, disponibilidad y plazo de entrega.» Borde lateral discreto y texto secundario. No aparece en disponible/agotado.
- Se elimina `calculateOrderPayment` y su prueba de redondeo: quedó sin consumidores y la UI no calcula anticipos. Política comercial 30% a cuenta/70% restante conservada en contenido; cotización e importes exactos por WhatsApp antes del pago.
- FAQ global: seis preguntas generales existentes más una entrada `Compras por encargo`. Resumen y cuatro subacordeones: funcionamiento, pago, plazo/imposibilidad de cumplir y cancelación/garantía. Grupo e hijos cerrados inicialmente. Sin nueve preguntas sueltas ni filtro por índice para construir la colección.
- `FaqList` admite una unión tipada de pregunta simple/grupo, con hijos simples. HTML nativo details/summary, sin controles dentro de summary, HTML inyectado ni biblioteca. La ficha por encargo recibe una sola pregunta resumida y enlace global; disponible/agotado conservan tres preguntas. Cómo comprar mantiene sus flujos.
- WhatsApp global integrado una vez desde StoreRoute. Componente y construcción del enlace dentro de WhatsApp; coordinación de paneles, consentimiento y toast en app. Configuración mediante `getWhatsAppNumber()` y `buildWhatsAppUrl()`. Número ausente/inválido: no se monta enlace activo.
- Mensaje exacto: `¡Hola! 👋 Quisiera realizar una consulta sobre los productos de VITRUNO. ¿Me pueden ayudar?`. Anchor explícito con target blank, noopener/noreferrer y aria-label `Consultar por WhatsApp`. Sin abrir ni enviar al montar, sin datos de producto/formulario.
- Se pospone instrumentar Contact global. No se clasifica como product_inquiry ni se cambian los eventos existentes; el clic global no emite eventos Meta, con o sin consentimiento.

## Diseño y convivencia

Círculo de 56 px, verde #128C4E, icono blanco Phosphor importado desde su módulo específico, hover/foco y sombra discreta. Sin pulso ni animación constante. Margen inferior/derecho 16 px móvil y 24 px desde sm, con safe areas; z-index 20, por debajo de cookies y paneles.

Oculto mientras hay panel de menú/carrito, banner/preferencias de cookies o cualquier toast, incluida su salida. Además cede espacio cuando su área, con margen preventivo de 8 px, coincide con controles de main/Footer al desplazarse. Medición agrupada con requestAnimationFrame por scroll/resize/foco, cambios de contenido/tamaño y fin de animación de ruta. Sin polling ni HTTP. Observers/listeners se limpian al bloquear/desmontar; visibility hidden lo retira también de la tabulación. Los enlaces grandes de imagen de ProductCard no se consideran CTAs inferiores.

QA detectó desbordamiento por textos sr-only de las acciones del carrusel sin contenedor posicionado. Se agregó `relative` al scrollport de relacionados, manteniendo esos elementos dentro del área desplazable; no se oculta el overflow del documento como parche.

## Pruebas automatizadas

Desde `client/`:

- `node --test tests/*.test.cjs`: 65 pruebas, 65 pasan, cero fallos/omitidas.
- `npm run lint`: OK.
- `npm run build`: OK.

Se reemplaza la prueba obsoleta de importes por comprobaciones del aviso sin cálculo; agrupación única de FAQ con cuatro hijos, ausencia de duplicados, condiciones 30/70 y selección contextual. Nueva prueba del mensaje general exacto, URL codificada, número configurado y valores ausentes/inválidos. Las pruebas de consultas individuales, carrito, SEO y Meta existentes siguen pasando.

## Navegador y responsive

Edge headless en desarrollo con fixtures HTTP locales y SDK Meta interceptado con ID de prueba. 36 combinaciones completadas: Inicio, FAQ, ficha por encargo, ficha disponible, Carrito y Contacto en 320, 375, 768, 1024, 1440 y 1920 px. Matriz completada en recorridos locales consecutivos; no se afirma validación productiva.

Resultados:

- Sin overflow horizontal del documento; carrusel conserva su scroll interno.
- Aviso solo por encargo, sin desglose de importes ni agregado al carrito; precio, badge, nota de entrega estimada y CTA permanecen. Nota de fixture distingue estimación de plazo confirmado.
- FAQ global con siete entradas principales y cuatro hijas en el único grupo de encargos. Cerradas inicialmente; apertura principal/hija con Enter y foco visible. Ningún enlace/botón dentro de summary. Ficha por encargo con una pregunta simple, otros estados con tres.
- Enlace global con mensaje, número, target y rel correctos. Tamaño/posición comprobados en seis anchos. Muestreo del scroll de las seis rutas a intervalos de 200 px: cero coincidencias visibles con controles tras las correcciones. No se garantiza que ese muestreo cubra cada píxel/estado futuro.
- Paneles abiertos ocultan el enlace; Escape cierra y devuelve foco al acceso del carrito. Agregar muestra toast y oculta el flotante durante su vida/salida, sin abrir Side Cart. Preferencias de cookies lo ocultan al reabrirse.
- Foco visible/activación por teclado, ausencia de animación del flotante con reduced motion. Sin pruebas físicas de lector de pantalla o notch; safe area comprobada en CSS, no en hardware.
- También se revisaron aparición/estado seguro en catálogo, Cómo comprar, agotado y 404. Cómo comprar conserva ocho pasos en total entre ambos flujos.

Recorrido adicional: configuración ausente simulada en el módulo env servido al navegador oculta el botón; los números inválidos se cubren en unit tests. Las capturas de FAQ y panel comercial mobile/desktop se inspeccionaron visualmente.

## SEO, analítica y regresiones

Canonical y Product JSON-LD de encargo conservados; availability sigue omitida según F19. Sin nuevas rutas, metadata, JSON-LD FAQPage, solicitudes SEO ni cambios a sitemap/robots. Transición y prefetch existentes conservados.

SDK interceptado: ViewContent y Contact individual una vez por ficha/consulta; AddToCart tras incremento y InitiateCheckout al pulsar el checkout habilitado. Sin Purchase. Activación del flotante no añade llamadas Meta. Contexto nuevo: unknown oculta botón por banner y no carga SDK; rechazar permite contacto sin cargar SDK. Sin abrir WhatsApp real, recepción en Events Manager ni validación productiva.

Sin cambios de backend, contratos de Cajora, precios/stock, persistencia v3, reglas de revalidación, mensajes individuales o checkout. No se agregaron dependencias, rutas ni llamadas HTTP de aplicación.

## Performance

Comparación orientativa con el snapshot documentado F21, sin construir de nuevo el checkout previo. F21: JS inicial agregado 598.79 kB / gzip 190.43; CSS 43.76 / 8.45. Build F21B: principal 496.24 / 156.19, runtime 102.27 / 34.06 y contenido inicial 5.79 / 2.08: total 604.30 / 192.33. Diferencia +5.51 / +1.90 kB JS. CSS 45.07 / 8.66 (+1.31 / +0.21).

447 módulos transformados; sin aviso de chunk >500 kB ni modificación de umbrales/configuración de build. Sin nuevos paquetes/lockfile. Observación del DOM solo mientras no hay bloqueo, agrupada por frame; no se ejecutó perfil de CPU ni medición de Core Web Vitals.

## Archivos

- `client/src/app/StoreRoute.tsx`: integración única.
- `client/src/app/compositions/FloatingWhatsAppContact.tsx`: coordinación de visibilidad.
- `client/src/app/compositions/ProductRecommendations.tsx`: contención del carrusel.
- `client/src/content/storefront-content.ts`: aviso, grupo y FAQ contextual.
- `client/src/features/catalog/components/ProductDetail.tsx`: aviso compacto.
- `client/src/features/catalog/domain/order-payment.ts`: eliminado.
- `client/src/features/whatsapp/components/FloatingWhatsAppButton.tsx`, `utils/whatsapp-general-inquiry.ts` e `index.ts`: enlace público seguro.
- `client/src/shared/components/guidance/FaqList.tsx`: estructura jerárquica.
- `client/tests/polish.test.cjs`, `client/tests/whatsapp.test.cjs`: regresiones.
- `docs/tasks.md`, `project-state.md`, `design.md`, `architecture.md`, `decisions.md` y este informe: estado y decisiones.

## Limitaciones y pendientes humanos

Revisión comercial/jurídica final de cotización, anticipo, saldo, cancelación, arrepentimiento, devolución y garantías. Los derechos aplicables se conservan en el copy; no se afirma cumplimiento integral. El mecanismo real de Botón de Arrepentimiento y las políticas legales finales siguen pendientes para una solicitud específica; no se crea un control decorativo. No se implementaron pagos, órdenes o cobros automáticos.

Pendientes de despliegue, dispositivos/lectores reales y paneles externos Meta/Search Console de F19/F20. El botón puede ocultarse durante scroll al coincidir con controles; es la política deliberada de prioridad a acciones de página. Su medición como consulta global requiere una futura ampliación explícita del origen de Contact. Sin bloqueos de implementación ni aprobaciones necesarias para los cambios locales.

## Evidencia local

Directorio `C:/Users/Abrah/.codex/visualizations/2026/10/01/01a0f4d0-0ee0-7c52-8453-0a514659d862/`: `f21b-qa.cjs`, `f21b-results.json`, `f21b-extra.cjs`, `f21b-extra-results.json`, `f21b-faq-375.png`, `f21b-faq-1440.png`, `f21b-order-panel-375.png` y `f21b-order-panel-1440.png`. Artefactos de QA fuera del repositorio.
