const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '../src')
const cache = new Map()
function load(relative) {
  const filename = path.resolve(root, relative + '.ts')
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const localRequire = specifier => specifier.startsWith('@/') ? load(specifier.slice(2)) : load(path.relative(root, path.resolve(path.dirname(filename), specifier)))
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports)
  return module.exports
}
const seo = load('shared/seo/seo')
const productSeo = load('pages/product/product-seo')
const input = { slug: 'cafe-123', name: '  Café & té 😀 ', description: ' Descripción\n real. ', imageUrl: 'https://images.example.com/cover.jpg', gallery: [{ imageUrl: 'https://images.example.com/cover.jpg' }, { imageUrl: '/gallery.jpg' }, { imageUrl: 'javascript:alert(1)' }], price: 12500.5, availabilityStatus: 'in_stock' }

test('canonicals enforce host and strip query, fragment and trailing slash', () => {
  assert.equal(seo.buildCanonical('/'), 'https://vitruno.com.ar/')
  assert.equal(seo.buildCanonical('/productos/?search=x&page=2#top'), 'https://vitruno.com.ar/productos')
  assert.equal(seo.buildCanonical('/productos/cafe-123'), 'https://vitruno.com.ar/productos/cafe-123')
  for (const invalid of ['https://other.test/', '//other.test/', 'productos', '/\\other.test/']) assert.throws(() => seo.buildCanonical(invalid))
})

test('SEO text normalization bounds descriptions without breaking surrogate pairs', () => {
  assert.equal(seo.normalizeSeoText('  Café\n &\t té '), 'Café & té')
  assert.equal(seo.normalizeSeoText('😀😀😀😀', 3), '😀😀…')
  assert.equal(seo.normalizeSeoText('Producto', 180), 'Producto')
})

test('image URLs accept public HTTP(S) paths and reject unsafe values', () => {
  assert.equal(seo.getSeoImageUrl('/cover.png'), 'https://vitruno.com.ar/cover.png')
  assert.equal(seo.getSeoImageUrl('cover.png', 'https://vitruno.com.ar/productos/cafe-123'), 'https://vitruno.com.ar/productos/cover.png')
  assert.equal(seo.getSeoImageUrl('https://cdn.example.com/p.jpg'), 'https://cdn.example.com/p.jpg')
  for (const value of [null, '', ' ', 'javascript:alert(1)', 'data:image/png,test', 'https://user:secret@example.com/p.jpg', 'http://[']) assert.equal(seo.getSeoImageUrl(value), undefined)
})

test('Product data uses real values, deduplicated images and numeric ARS price', () => {
  const before = structuredClone(input)
  const result = productSeo.getProductSeo(input)
  assert.equal(result.title, 'Café & té 😀 | VITRUNO')
  assert.equal(result.canonical, 'https://vitruno.com.ar/productos/cafe-123')
  assert.equal(result.description, 'Descripción real.')
  assert.equal(result.ogType, 'product')
  assert.equal(result.structuredData['@type'], 'Product')
  assert.deepEqual(result.structuredData.image, ['https://images.example.com/cover.jpg', 'https://vitruno.com.ar/gallery.jpg'])
  assert.equal(result.structuredData.offers.priceCurrency, 'ARS')
  assert.equal(result.structuredData.offers.price, 12500.5)
  assert.equal(result.structuredData.offers.availability, 'https://schema.org/InStock')
  for (const key of ['sku','gtin','brand','review','aggregateRating','shippingDetails','returnPolicy']) assert.equal(key in result.structuredData, false)
  assert.deepEqual(input, before)
})

test('availability is commercial and never inferred from physical stock', () => {
  assert.equal(productSeo.getSchemaAvailability('in_stock'), 'https://schema.org/InStock')
  assert.equal(productSeo.getSchemaAvailability('out_of_stock'), 'https://schema.org/OutOfStock')
  assert.equal(productSeo.getSchemaAvailability('on_order'), undefined)
  const result = productSeo.getProductSeo({ ...input, availabilityStatus: 'on_order', stockAvailable: 9999 })
  assert.equal('availability' in result.structuredData.offers, false)
  assert.equal(result.robots, 'index,follow')
})

test('missing content has neutral fallbacks, invalid prices never create Offers', () => {
  for (const price of [-1, NaN, Infinity]) assert.equal('offers' in productSeo.getProductSeo({ ...input, price }).structuredData, false)
  assert.equal(productSeo.getProductSeo({ ...input, name: ' ' }).title, 'Producto | VITRUNO')
  const result = productSeo.getProductSeo({ ...input, description: null, imageUrl: null, gallery: [], price: 0 })
  assert.equal(result.ogImage, seo.DEFAULT_OG_IMAGE)
  assert.equal('image' in result.structuredData, false)
  assert.equal(result.structuredData.offers.price, 0)
  assert(result.description.includes('confirmá precio y disponibilidad'))
})

test('safe JSON-LD serialization cannot terminate a script or emit arbitrary markup', () => {
  const value = { name: '</script><script>alert(1)</script>', text: '\u2028\u2029' }
  const serialized = seo.serializeStructuredData(value)
  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), value)
})

test('public routes have unique metadata; loading/error drop prior Product data', () => {
  const { routeSeo, getNotFoundSeo } = load('content/seo-content')
  assert.equal(new Set(Object.values(routeSeo).map(x => x.title)).size, 6)
  assert.equal(routeSeo.cart.robots, 'noindex,follow')
  assert.equal(getNotFoundSeo('/404').robots, 'noindex,follow')
  assert.equal(productSeo.getPendingProductSeo('/productos/new').title, 'Producto | VITRUNO')
  assert.equal(productSeo.getPendingProductSeo('/productos/new').structuredData, undefined)
  assert.equal(productSeo.getPendingProductSeo('/productos/new', true).robots, 'noindex,follow')
})

test('sitemap and robots contain only the approved public canonical routes', () => {
  const sitemap = fs.readFileSync(path.resolve(__dirname, '../public/sitemap.xml'), 'utf8')
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])
  assert.deepEqual(urls, ['https://vitruno.com.ar/', 'https://vitruno.com.ar/productos', 'https://vitruno.com.ar/como-comprar', 'https://vitruno.com.ar/preguntas-frecuentes', 'https://vitruno.com.ar/contacto'])
  assert(!/lastmod|localhost|onrender|carrito|\?/.test(sitemap.replace(/^<\?xml.*?\?>\s*/, '')))
  const robots = fs.readFileSync(path.resolve(__dirname, '../public/robots.txt'), 'utf8')
  assert(robots.includes('Allow: /'))
  assert(robots.includes('Sitemap: https://vitruno.com.ar/sitemap.xml'))
})
