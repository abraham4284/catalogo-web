# Producto

## Objetivo
Storefront público rápido, mobile-first y simple para exhibir productos del comercio y convertir consultas en conversaciones de WhatsApp. Marca aún no definida: ningún nombre temporal de pruebas constituye branding final.

## MVP
Identidad básica del negocio, Home, catálogo, categorías, búsqueda, filtro por categoría, listado paginado, detalle de producto, portada y galería, precio, disponibilidad, carrito local, cierre por WhatsApp y responsive.

## Contrato externo disponible: Cajora Public API
Contrato provisto para el proyecto; F0 no realiza integración ni verifica el backend.

```http
GET /api/public/catalog
GET /api/public/catalog/categories
GET /api/public/catalog/products
GET /api/public/catalog/products/:idProduct
```

El listado acepta `page`, `limit`, `search`, `idProductCategory`. Defaults conocidos: `page = 1`, `limit = 24`, máximo `limit = 60`.

DTO público del negocio (campos disponibles; tipos y nulabilidad se validarán en F2):

```text
{ name, slug, logoUrl, businessType }
```

DTO público del producto en listado:

```text
{
  idProduct, name, description, price, imageUrl,
  category: { idProductCategory, name },
  available
}
```

Detalle: los mismos campos más `gallery: [{ imageUrl, altText, sortOrder }]`.
No asumir campos administrativos ni exponer/depender de `idBusiness`, costo, stock exacto, depósito, barcode, precio mayorista o timestamps internos. El formato del envelope y el DTO de categorías se confirmarán en F2.

## Carrito y conversión
Primera versión prevista: Zustand + localStorage; agregar, quitar, cambiar cantidades, vaciar y calcular total. Sin backend de carrito/pedidos en el MVP. El frontend prepara un mensaje y abre WhatsApp; el flujo web termina allí. La venta se registra manualmente en Cajora.

## Fuera de alcance actual
Login/cuentas de clientes, autenticación pública, checkout backend, Mercado Pago, reservas de stock, órdenes web persistidas, shipping, wishlist, cupones, reviews, blog, comentarios y sincronización bidireccional.

## Futuro
Un blog podría tener su propia API/DB. El Storefront podrá consumirlo como otra fuente HTTP sin mezclar sus datos con Cajora.
