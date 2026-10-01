# Arquitectura

Storefront independiente del frontend administrativo de Cajora. Frontera externa: Storefront → Cajora Public API → DB_COMERCIO. Puede consumir otras APIs independientes.

## Estructura objetivo (crecimiento orgánico)

```text
src/
├── app/                         # App, router, providers globales reales
├── pages/                       # home, catalog, product, not-found
├── features/
│   ├── catalog/                 # api, components, hooks, schemas, types
│   ├── cart/                    # components, store, domain, hooks, types
│   ├── search/
│   └── whatsapp/
├── shared/
│   ├── api/
│   ├── components/              # layout, ui (shadcn)
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── config/
├── assets/
├── index.css
└── main.tsx
```

Este árbol describe responsabilidades futuras, no carpetas que deban crearse vacías. F0 materializa `app`, `pages/home`, `pages/not-found`, `shared/components/ui` y `shared/lib`. `config`, providers, APIs y features se crean cuando exista código real.

## Responsabilidades
- `app`: composition root, App, Router y providers necesarios; sin dominio.
- `pages`: composición de features; sin Axios directo, reglas de carrito ni infraestructura.
- `features`: código específico de una capacidad. Feature-specific code stays inside the feature. Un blog futuro tendrá su propia feature.
- `shared`: solo reutilización genuina entre features; no un cajón de archivos.
- `shared/components/ui`: primitives genéricas/shadcn. ProductCard, CartDrawer y CategoryFilter pertenecen a sus features.
- `config`: configuración real de la aplicación, sin placeholders.

## Fronteras HTTP
Separar clientes HTTP por dominio externo:

```text
features/catalog → catalog API module → catalogHttp → Cajora Public API
features/blog    → blog API module    → blogHttp    → Blog API (futuro)
```

React nunca llama Axios directamente. No crear un cliente global acoplado exclusivamente a Cajora.

F2 implementa `shared/api/catalog-http.ts` (Axios lazy, timeout 15 s, sin credenciales ni Authorization) y `features/catalog/api/catalog.api.ts` (cuatro funciones async; input y envelope validados, retorno solo de data). Schemas en `features/catalog/schemas/catalog.schemas.ts`; tipos derivados en `types/catalog.types.ts`; exportaciones públicas en `features/catalog/index.ts`.

`catalog.error.ts` normaliza INVALID_INPUT, INVALID_RESPONSE, HTTP y NETWORK. Los fallos HTTP con body ajeno al contrato son INVALID_RESPONSE y conservan statusCode. Cancelaciones conservan `isCancelled` sin añadir otro código; las funciones admiten AbortSignal opcional. Los mensajes backend/fieldErrors son internos: `catalog-presentation-error.ts` proporciona mensajes seguros. Loading/error/empty son primitives accesibles usadas por las páginas.

F3 incorpora `useCatalogHome` (negocio, categorías y primeros 8 productos en paralelo) y `useCatalogListing` (categorías y listado de 24 productos). Los efectos cancelan mediante AbortController; callbacks obsoletos no publican datos/errores y el listado oculta datos de otra query. Sin estado global ni fetching desde componentes visuales.

`catalog-url.ts` centraliza parsing seguro y construcción de enlaces para search/category/page. La URL es la fuente de verdad; cambios de búsqueda/categoría reinician página, paginación conserva filtros. Los parámetros manuales inválidos se normalizan antes de consultar. Si una respuesta exitosa confirma page > totalPages, CatalogPage usa Navigate con replace a la última página válida conservando filtros. Pages consumen exclusivamente el barrel público de la feature. `CatalogPaginationControls` es el nombre público del componente, separado del tipo DTO `CatalogPagination`.

`catalog-product-route.ts` valida IDs decimales positivos seguros antes de montar el fetching. `useCatalogProduct` asocia resultados al ID solicitado y aborta al cambiar/desmontar; mantiene CatalogRequestState con reason opcional not-found para HTTP 404. La página monta contenido por ID para reiniciar datos y selección de imágenes.

`catalog-gallery.ts` construye portada y galería ordenada/deduplicada sin mutar el DTO. ProductGallery recibe solo nombre, portada y galería, controla miniaturas accesibles y reserva aspect ratio. CatalogImage comparte el fallback de imágenes ausentes/rotas entre detalle y cards; su estado se reinicia al cambiar URL. ProductDetail presenta el contrato público con el formatter y enlaces existentes, sin HTML externo ni lógica de compra.

Pruebas de frontera sin red: desde `client/`, `node --test tests/catalog.test.cjs`. Usan TypeScript instalado para cargar módulos en memoria y un adaptador Axios simulado, sin dependencias adicionales.

## Carrito local
`features/cart/domain/cart.ts` calcula subtotal, total y unidades sin infraestructura. Schemas Zod y tipos derivados definen un snapshot mínimo idProduct/name/price/quantity. `cart.store.ts` usa Zustand persist, versión 1 y partialize solo de items. `cart.storage.ts` aísla localStorage, valida el envelope/estado al leer y devuelve vacío ante JSON corrupto, versión incompatible, filas duplicadas o campos inválidos; acceso/escritura bloqueados no rompen el store en memoria. Totales no se persisten.

ProductDetail acepta un slot genérico actions; ProductDetailPage compone AddToCartButton desde el barrel cart con snapshot y available. Catalog no depende de cart; cart no depende de DTOs catalog. CartPage compone filas/resumen, y Header ofrece un enlace estático sin estado. `shared/utils/format-currency.ts` comparte el formatter es-AR/ARS entre ambas features.

Snapshots locales no garantizan precio/disponibilidad actuales ni reservan stock. Re-agregar actualiza nombre/precio y aumenta cantidad; no se revalida el carrito contra backend. Pruebas: `node --test tests/cart.test.cjs`, con store real, almacenamiento simulado y sin DOM ni dependencias nuevas.

## WhatsApp handoff
CartPage compone cart y whatsapp mediante sus barrels públicos; las features no se importan entre sí. WhatsAppCheckoutItem define solo nombre/precio/cantidad. `domain/whatsapp-message.ts` construye texto determinista con nombres normalizados y formatter monetario compartido; `utils/whatsapp-url.ts` valida destino y codifica el mensaje con encodeURIComponent.

`utils/whatsapp-checkout.ts` une configuración lazy y funciones puras, devolviendo undefined ante carrito vacío, configuración inválida o mensaje no generable. WhatsAppCheckoutLink renderiza un enlace real wa.me con target=_blank y rel=noopener noreferrer, o CTA deshabilitado con mensaje seguro. Sin llamadas HTTP, datos personales adicionales ni limpieza del carrito. Pruebas puras/configuración: `node --test tests/whatsapp.test.cjs`.

## Clean Architecture pragmática
Flujo conceptual: UI → Application / Feature logic → Domain rules → Infrastructure boundary. Las reglas puras de dominio no importan React, Axios ni almacenamiento; los módulos de infraestructura adaptan contratos externos. Separar responsabilidades sin interfaces/capas vacías.

## Baseline F0
`main.tsx` monta `app/App.tsx`; App entrega el router con rutas `/` y `*`. Home y Not Found son mínimas. Alias `@/*` apunta a `src/*` en TypeScript y Vite; shadcn genera UI y utilidades dentro de `shared`. Se mantiene el preset existente, incluidos sus radios explícitos, sin refactor visual.

ESLint permite la exportación `buttonVariants` únicamente en el botón shadcn para conservar su contrato generado; la regla de Fast Refresh sigue activa para los demás archivos.
