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
Zustand + localStorage v3, clave catalogo-web-cart. Snapshot idProduct/slug/name/price/imageUrl/availabilityStatus/stockAvailable y quantity; sin booleano legacy ni campos comerciales ajenos. v1/v2/futuras, JSON corrupto, IDs/slugs duplicados y campos inválidos producen vacío seguro; storage bloqueado/lleno conserva memoria usable. Solo in_stock con stock >= 1 agrega, incrementa hasta el último stock conocido y decrementa con mínimo 1. Re-agregar actualiza snapshot; reconcile preserva quantity y evita writes idénticos. Imagen/nombre forman un único enlace /productos/<slug>. Agotado/encargo permanecen visibles con cantidad deshabilitada; exceso de quantity mantiene aviso, permite disminuir/eliminar y bloquea checkout.

Al entrar a carrito se verifican precio/disponibilidad actuales contra Cajora por slug en paralelo. Cambios del conjunto y retry revalidan; quantity no. Un fallo conserva el item, señala la fila y bloquea WhatsApp hasta reintentar. Solo verificación completa exitosa e items in_stock con cantidades coherentes habilitan el enlace. Precio nuevo se refleja en fila, total y mensaje. ON_ORDER queda fuera de agregados y del checkout grupal incluso con stock físico.

El frontend prepara el mensaje y abre WhatsApp; la venta se confirma allí y se registra manualmente en Cajora. Sin backend de órdenes, reservas ni polling: el stock puede cambiar después de verificar. unitType no es público, cantidades enteras/paso 1. Cards/detalle conservan consulta individual triestado.

## Fuera de alcance actual
Login/cuentas de clientes, autenticación pública, checkout backend, Mercado Pago, reservas de stock, órdenes web persistidas, shipping, wishlist, cupones, reviews, blog, comentarios y sincronización bidireccional.

## Futuro
Un blog podría tener su propia API/DB. El Storefront podrá consumirlo como otra fuente HTTP sin mezclar sus datos con Cajora.
