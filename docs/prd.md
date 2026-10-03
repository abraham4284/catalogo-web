# Producto

## Objetivo
Storefront público rápido, mobile-first y simple para exhibir productos del comercio y convertir consultas en conversaciones de WhatsApp. Marca aún no definida: ningún nombre temporal de pruebas constituye branding final.

## MVP
Identidad básica del negocio, Home, catálogo, categorías, búsqueda, filtro por categoría, listado paginado, detalle de producto, portada y galería, precio, disponibilidad, carrito local, cierre por WhatsApp y responsive.

## Contrato externo disponible: Cajora Public API
Contrato confirmado en F2 y actualizado por el documento F10A, implementado en la frontera frontend. No se verificó contra producción. `VITE_CATALOG_API_URL` representa el prefijo completo `/api/public`; las funciones agregan `/catalog` y sus subrutas.

```http
GET /api/public/catalog
GET /api/public/catalog/categories
GET /api/public/catalog/products
GET /api/public/catalog/products/:slug
```

El listado acepta `page` (entero >= 1), `limit` (entero entre 1 y 60), `search` (trim, máximo 150 caracteres) y `categorySlug` (slug público). IDs técnicos se conservan como enteros positivos; la navegación usa slugs del backend, nunca derivados del nombre. Slug: máximo 180 caracteres y patrón `^[a-z0-9]+(?:-[a-z0-9]+)*$`, sin trim ni conversión a minúsculas; `123` es válido. Defaults backend: `page = 1`, `limit = 24`; filtros vacíos se omiten.

DTO público del negocio:

```ts
{ name: string, slug: string, logoUrl: string | null, businessType: string | null }
```

DTO público del producto en listado:

```ts
{
  idProduct: number,
  slug: string,
  name: string,
  description: string | null,
  price: number,
  imageUrl: string | null,
  category: { idProductCategory: number, name: string, slug: string },
  saleMode: 'stock' | 'on_order',
  availabilityStatus: 'in_stock' | 'out_of_stock' | 'on_order',
  availabilityNote: string | null,
  stockAvailable: number,
  secondaryImageUrl: string | null
}
```

Categorías: array de `{ idProductCategory: number, name: string, slug: string }` con ID entero positivo.

Detalle: campos comunes del listado (sin secondaryImageUrl), más `gallery: [{ imageUrl: string, altText: string | null, sortOrder: number }]` y `richContent: ProductRichContent | null`; sortOrder entero no negativo (restricción DB confirmada en F3). Las imágenes se aceptan como strings porque el contrato no garantiza URLs absolutas; pueden ser rutas relativas. El listado no incluye gallery ni richContent y no se consultan detalles por card.

`stockAvailable` es entero no negativo del depósito principal/default activo, sin sumar depósitos. Se consume internamente; no se muestra la cantidad exacta ni se envía por WhatsApp. La UI usa exclusivamente availabilityStatus: Disponible, No disponible o Por encargo. No recalcula el estado desde saleMode/stockAvailable. Solo in_stock ofrece agregado; los tres estados ofrecen consultas WhatsApp con textos propios. availabilityNote no vacía se presenta como texto plano en detalle.

ProductRichContent v1: `{ version: 1, blocks }`. Bloques discriminados: heading (level 2/3, text), paragraph (text), list (style bullet/numbered, items string[]) y specs (items label/value). Descripción es resumen corto; richContent es información detallada semántica, nunca HTML arbitrario. Límites: 30 bloques, heading 150 caracteres, paragraph 3000, listas/specs 1–30 items, item/valor 500 y label 100.

Listado paginado: `{ items: ProductListItem[], pagination: { page, currentPage, limit, total, totalRecords, totalPages } }`. Todos los campos de paginación son enteros; page/currentPage/totalPages positivos, limit entre 1 y 60 y total/totalRecords no negativos. Se preservan `page / currentPage` y `total / totalRecords`; totalPages es al menos 1 incluso para una lista vacía, según `Math.max(1, ceil(total / limit))` confirmado en F3.

Envelope exitoso: `{ status: true, message: string, data: ... }`. Envelope de error: `{ status: false, message: string, errors?: { field: string, message: string }[] }`. Un fallo HTTP también puede devolver un body que no respete el contrato.

No asumir campos administrativos ni exponer/depender de `idBusiness`, costo, depósitos, barcode, precio mayorista o timestamps internos. La cantidad pública stockAvailable solo limita/reconcilia el carrito; no representa una reserva.

## Carrito y conversión
Zustand + localStorage v2: agregar, quitar, cambiar cantidades, vaciar y calcular total; snapshot con imagen, disponibilidad y último stock conocido. Nuevos agregados/incrementos limitados por stock. Al recibir un producto actual se reconcilia sin requests extra; cantidades excesivas o productos no disponibles permanecen visibles y bloquean la consulta normal hasta revisión. Persistencia v1/incompatible se descarta de forma segura. Sin backend de carrito/pedidos en el MVP. F10A conserva v2 mediante adaptador temporal available = availabilityStatus === in_stock; ON_ORDER queda fuera del carrito incluso con stock físico. Imagen/nombre del carrito no enlazan al detalle porque v2 no guarda slug. F10B migrará el carrito. Sin unitType público, solo se soportan cantidades enteras con paso 1. Cards/detalle también permiten consulta individual. El frontend prepara un mensaje y abre WhatsApp; el flujo web termina allí. La venta se registra manualmente en Cajora.

## Fuera de alcance actual
Login/cuentas de clientes, autenticación pública, checkout backend, Mercado Pago, reservas de stock, órdenes web persistidas, shipping, wishlist, cupones, reviews, blog, comentarios y sincronización bidireccional.

## Futuro
Un blog podría tener su propia API/DB. El Storefront podrá consumirlo como otra fuente HTTP sin mezclar sus datos con Cajora.
