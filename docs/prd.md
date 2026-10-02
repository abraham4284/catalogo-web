# Producto

## Objetivo
Storefront público rápido, mobile-first y simple para exhibir productos del comercio y convertir consultas en conversaciones de WhatsApp. Marca aún no definida: ningún nombre temporal de pruebas constituye branding final.

## MVP
Identidad básica del negocio, Home, catálogo, categorías, búsqueda, filtro por categoría, listado paginado, detalle de producto, portada y galería, precio, disponibilidad, carrito local, cierre por WhatsApp y responsive.

## Contrato externo disponible: Cajora Public API
Contrato confirmado en F2 y actualizado por el documento F9, implementado en la frontera frontend. No se verificó contra producción. `VITE_CATALOG_API_URL` representa el prefijo completo `/api/public`; las funciones agregan `/catalog` y sus subrutas.

```http
GET /api/public/catalog
GET /api/public/catalog/categories
GET /api/public/catalog/products
GET /api/public/catalog/products/:idProduct
```

El listado acepta `page` (entero >= 1), `limit` (entero entre 1 y 60), `search` (trim, máximo 150 caracteres) e `idProductCategory` (entero positivo). `idProduct` también es entero positivo. Defaults backend: `page = 1`, `limit = 24`; filtros vacíos se omiten.

DTO público del negocio:

```ts
{ name: string, slug: string, logoUrl: string | null, businessType: string | null }
```

DTO público del producto en listado:

```ts
{
  idProduct: number,
  name: string,
  description: string | null,
  price: number,
  imageUrl: string | null,
  category: { idProductCategory: number, name: string },
  available: boolean,
  stockAvailable: number,
  secondaryImageUrl: string | null
}
```

Categorías: array de `{ idProductCategory: number, name: string }` con ID entero positivo.

Detalle: campos comunes del listado (sin secondaryImageUrl), más `gallery: [{ imageUrl: string, altText: string | null, sortOrder: number }]` y `richContent: ProductRichContent | null`; sortOrder entero no negativo (restricción DB confirmada en F3). Las imágenes se aceptan como strings porque el contrato no garantiza URLs absolutas; pueden ser rutas relativas. El listado no incluye gallery ni richContent y no se consultan detalles por card.

`stockAvailable` es entero no negativo del depósito principal/default activo, sin sumar depósitos. Se consume internamente; no se muestra la cantidad exacta ni se envía por WhatsApp. Disponibilidad: `available && stockAvailable > 0`.

ProductRichContent v1: `{ version: 1, blocks }`. Bloques discriminados: heading (level 2/3, text), paragraph (text), list (style bullet/numbered, items string[]) y specs (items label/value). Descripción es resumen corto; richContent es información detallada semántica, nunca HTML arbitrario.

Listado paginado: `{ items: ProductListItem[], pagination: { page, currentPage, limit, total, totalRecords, totalPages } }`. Todos los campos de paginación son enteros; page/currentPage/totalPages positivos, limit entre 1 y 60 y total/totalRecords no negativos. Se preservan `page / currentPage` y `total / totalRecords`; totalPages es al menos 1 incluso para una lista vacía, según `Math.max(1, ceil(total / limit))` confirmado en F3.

Envelope exitoso: `{ status: true, message: string, data: ... }`. Envelope de error: `{ status: false, message: string, errors?: { field: string, message: string }[] }`. Un fallo HTTP también puede devolver un body que no respete el contrato.

No asumir campos administrativos ni exponer/depender de `idBusiness`, costo, depósitos, barcode, precio mayorista o timestamps internos. La cantidad pública stockAvailable solo limita/reconcilia el carrito; no representa una reserva.

## Carrito y conversión
Zustand + localStorage v2: agregar, quitar, cambiar cantidades, vaciar y calcular total; snapshot con imagen, disponibilidad y último stock conocido. Nuevos agregados/incrementos limitados por stock. Al recibir un producto actual se reconcilia sin requests extra; cantidades excesivas o productos no disponibles permanecen visibles y bloquean la consulta normal hasta revisión. Persistencia v1/incompatible se descarta de forma segura. Sin backend de carrito/pedidos en el MVP. Cards/detalle también permiten consulta individual. El frontend prepara un mensaje y abre WhatsApp; el flujo web termina allí. La venta se registra manualmente en Cajora.

## Fuera de alcance actual
Login/cuentas de clientes, autenticación pública, checkout backend, Mercado Pago, reservas de stock, órdenes web persistidas, shipping, wishlist, cupones, reviews, blog, comentarios y sincronización bidireccional.

## Futuro
Un blog podría tener su propia API/DB. El Storefront podrá consumirlo como otra fuente HTTP sin mezclar sus datos con Cajora.
