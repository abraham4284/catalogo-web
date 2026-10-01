# Producto

## Objetivo
Storefront público rápido, mobile-first y simple para exhibir productos del comercio y convertir consultas en conversaciones de WhatsApp. Marca aún no definida: ningún nombre temporal de pruebas constituye branding final.

## MVP
Identidad básica del negocio, Home, catálogo, categorías, búsqueda, filtro por categoría, listado paginado, detalle de producto, portada y galería, precio, disponibilidad, carrito local, cierre por WhatsApp y responsive.

## Contrato externo disponible: Cajora Public API
Contrato confirmado en el documento F2 e implementado en la frontera frontend. No se verificó contra producción. `VITE_CATALOG_API_URL` representa el prefijo completo `/api/public`; las funciones agregan `/catalog` y sus subrutas.

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
  available: boolean
}
```

Categorías: array de `{ idProductCategory: number, name: string }` con ID entero positivo.

Detalle: los mismos campos más `gallery: [{ imageUrl: string, altText: string | null, sortOrder: number }]`; sortOrder entero no negativo (restricción DB confirmada en F3). Las imágenes se aceptan como strings porque el contrato no garantiza URLs absolutas; pueden ser rutas relativas.

Listado paginado: `{ items: ProductListItem[], pagination: { page, currentPage, limit, total, totalRecords, totalPages } }`. Todos los campos de paginación son enteros; page/currentPage/totalPages positivos, limit entre 1 y 60 y total/totalRecords no negativos. Se preservan `page / currentPage` y `total / totalRecords`; totalPages es al menos 1 incluso para una lista vacía, según `Math.max(1, ceil(total / limit))` confirmado en F3.

Envelope exitoso: `{ status: true, message: string, data: ... }`. Envelope de error: `{ status: false, message: string, errors?: { field: string, message: string }[] }`. Un fallo HTTP también puede devolver un body que no respete el contrato.

No asumir campos administrativos ni exponer/depender de `idBusiness`, costo, stock exacto, depósito, barcode, precio mayorista o timestamps internos.

## Carrito y conversión
Primera versión prevista: Zustand + localStorage; agregar, quitar, cambiar cantidades, vaciar y calcular total. Sin backend de carrito/pedidos en el MVP. El frontend prepara un mensaje y abre WhatsApp; el flujo web termina allí. La venta se registra manualmente en Cajora.

## Fuera de alcance actual
Login/cuentas de clientes, autenticación pública, checkout backend, Mercado Pago, reservas de stock, órdenes web persistidas, shipping, wishlist, cupones, reviews, blog, comentarios y sincronización bidireccional.

## Futuro
Un blog podría tener su propia API/DB. El Storefront podrá consumirlo como otra fuente HTTP sin mezclar sus datos con Cajora.
