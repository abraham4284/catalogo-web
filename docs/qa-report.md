# Technical QA — F8

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
