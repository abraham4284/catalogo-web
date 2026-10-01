# Decisiones

## DEC-001 — React for MVP
Decisión: React + TypeScript + Vite. Razón: equipo familiarizado con el stack y velocidad de validación. Consecuencia: evaluar Astro solo si mediciones reales justifican un cambio.

## DEC-002 — Storefront repository independent from Cajora
Decisión: repositorio independiente que consume Cajora Public API. Razón: separar experiencia pública de administración. Consecuencia: sin dependencias del frontend administrativo.

## DEC-003 — Neutral brandable design
Decisión: tokens semánticos sin identidad final. Razón: branding pendiente. Consecuencia: ajustar identidad posteriormente sin reescribir componentes.

## DEC-004 — Feature-based frontend architecture
Decisión: `app / pages / features / shared / config`. Razón: responsabilidades próximas a cada capacidad. Consecuencia: crear carpetas solo cuando exista implementación real.

## DEC-005 — Pragmatic Clean Architecture
Decisión: separar responsabilidades/fronteras sin ceremonia. Razón: claridad y testabilidad sin capas vacías. Consecuencia: abstraer únicamente problemas concretos.

## DEC-006 — Cart is frontend-only in MVP
Decisión: Zustand + localStorage. Razón: MVP sin backend de órdenes. Consecuencia: carrito local, sin reservas ni pedidos persistidos en servidor.

## DEC-007 — WhatsApp is initial conversion endpoint
Decisión: carrito genera mensaje y abre WhatsApp. Razón: conversión simple. Consecuencia: flujo web termina en el handoff y la venta se registra manualmente en Cajora.

## DEC-008 — Future content systems stay separable
Decisión: blog posible con API/DB propias. Razón: independencia del contenido y el comercio. Consecuencia: múltiples clientes HTTP por dominio, sin mezclar datos con Cajora.

## DEC-009 — WhatsApp contact configured by environment for MVP
Decisión: configurar el contacto mediante VITE_WHATSAPP_NUMBER con validación lazy. Razón: CatalogBusiness todavía no publica contacto y existe un único Storefront comercial; evita acoplar Cajora a una necesidad aún no multi-tenant pública. Consecuencia: el número es público y puede migrarse posteriormente a configuración del negocio/API sin cambiar el dominio del carrito.
