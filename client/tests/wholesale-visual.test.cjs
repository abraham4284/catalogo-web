const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { MemoryRouter } = require('react-router-dom')
let previewItems = []
const root = path.resolve(__dirname, '../src')
const cache = new Map()
let policy = { wholesaleEnabled: true, wholesaleMinimumAmount: 50000 }
function load(name) {
  const base = path.resolve(root, name)
  if (base.endsWith(path.join('store', 'cart.store'))) return { useCartStore: selector => selector({ items: previewItems }) }
  if (base.endsWith(path.join('store', 'business.store'))) return { useCatalogPricing: () => policy }
  const file = ['.ts', '.tsx'].map(ext => base + ext).find(file => fs.existsSync(file))
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const req = name => name.startsWith('@/') ? load(name.slice(2)) : name.startsWith('.') ? load(path.relative(root, path.resolve(path.dirname(file), name))) : require(name)
  new Function('require', 'module', 'exports', output)(req, module, module.exports)
  return module.exports
}
const { getWholesaleProgress: progress } = load('features/cart/utils/wholesale-progress')
const { ProductPrices, WholesaleNotice } = load('features/catalog/components/ProductPrices')
const { CartPricingStatus } = load('features/cart/components/CartPricingStatus')
const { CartSummary } = load('features/cart/components/CartSummary')
const { CartPreview } = load('features/cart/components/CartPreview')
const { calculateCartPricing } = load('features/cart/domain/pricing')
const { formatCurrency } = load('shared/utils/format-currency')
const render = (component, props) => renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(component, props)))
const base = { wholesaleEnabled: true, lines: [{}], allItemsHaveWholesalePrice: true, wholesaleCandidate: 0, wholesaleMinimumAmount: 50000 }
const item = { idProduct: 1, slug: 'uno', name: 'Uno', priceSale: 90000, priceWholesale: 25000, quantity: 1, stockAvailable: 10, availabilityStatus: 'in_stock', imageUrl: null }

test('visual progress uses only wholesale candidate, caps at 100 and preserves decimals', () => {
  for (const [candidate, expected] of [[0,0],[1,0.002],[25000,50],[49999,99.998],[50000,100],[50001,100],[Number.MAX_VALUE,100]]) {
    const result = progress({ ...base, wholesaleCandidate: candidate, retailSubtotal: 999999, effectiveSubtotal: 999999 })
    assert(Math.abs(result - expected) < 1e-9)
    assert(result >= 0 && result <= 100)
  }
  assert.equal(progress({ ...base, wholesaleMinimumAmount: 1.5, wholesaleCandidate: .75 }),50)
})
test('visual progress guards invalid amounts and nonpositive minimum', () => {
  for (const minimum of [0,-1,NaN,Infinity]) assert.equal(progress({ ...base, wholesaleMinimumAmount: minimum }),undefined)
  for (const candidate of [-1,NaN,Infinity]) assert.equal(progress({ ...base, wholesaleCandidate: candidate }),undefined)
})
test('disabled, empty and retail-only lines suppress progress', () => {
  for (const update of [{wholesaleEnabled:false},{lines:[]},{allItemsHaveWholesalePrice:false}]) assert.equal(progress({...base,...update}),undefined)
})
test('valid wholesale remains dominant with retail visible and no strike-through', () => {
  policy = { wholesaleEnabled:true, wholesaleMinimumAmount:50000 }
  const html = render(ProductPrices,{priceSale:30000,priceWholesale:20000})
  assert(html.indexOf(formatCurrency(20000)) < html.indexOf(formatCurrency(30000)))
  assert(html.includes('Mayorista'))
  assert(html.includes('Minorista'))
  assert(!/line-through|<del|No disponible|Solo minorista/.test(html))
})
test('missing and invalid wholesale render neutral Solo minorista without fake zero', () => {
  for (const priceWholesale of [null,0,-1,NaN,Infinity]) {
    const html=render(ProductPrices,{priceSale:30000,priceWholesale,variant:'detail'})
    assert(html.includes('Solo minorista'))
    assert(html.includes('Precio minorista'))
    assert(html.includes(formatCurrency(30000)))
    assert(!html.includes('No disponible'))
    assert(!html.includes(formatCurrency(0)))
  }
})
test('disabled policy keeps plain retail presentation', () => {
  policy = { wholesaleEnabled:false,wholesaleMinimumAmount:50000 }
  const html=render(ProductPrices,{priceSale:30000,priceWholesale:20000})
  assert(html.includes(formatCurrency(30000)))
  assert(!html.includes('Mayorista'))
  assert(!html.includes('Solo minorista'))
  assert.equal(render(WholesaleNotice,{}),'')
  policy={wholesaleEnabled:true,wholesaleMinimumAmount:50000}
})
test('catalog notice keeps a dynamic minimum and a navigable FAQ link', () => {
  const html=render(WholesaleNotice,{})
  assert(html.includes(`Mayorista desde ${formatCurrency(policy.wholesaleMinimumAmount)} en valor mayorista`))
  assert(html.includes('Podés combinar categorías.'))
  assert(html.includes('href="/preguntas-frecuentes#compras-minoristas-y-mayoristas"'))
  assert(html.includes('¿Cómo funciona?'))
})
test('partial cart progress is accessible and compact variant omits the full explanatory paragraph', () => {
  const pricing=calculateCartPricing([item],policy)
  const full=render(CartPricingStatus,{pricing})
  assert(render(CartSummary,{pricing}).includes('Compra minorista'))
  assert(full.includes('role="progressbar"'))
  for (const attribute of ['aria-valuemin="0"','aria-valuemax="100"','aria-valuenow="50"','aria-label="Progreso hacia el precio mayorista"']) assert(full.includes(attribute))
  assert(full.includes('width:50%'))
  assert(full.includes(`Te faltan ${formatCurrency(25000)}`))
  const compact=render(CartPricingStatus,{pricing,variant:'compact'})
  assert(compact.includes('width:50%'))
  assert(compact.includes('Calculado con precios mayoristas.'))
  assert(!compact.includes('El progreso se calcula usando'))
  assert(full.includes('El progreso se calcula usando los precios mayoristas de los productos de tu carrito.'))
})
test('wholesale success caps bar at 100 and retains domain savings', () => {
  const pricing=calculateCartPricing([{...item,quantity:3}],policy)
  const html=render(CartPricingStatus,{pricing})
  assert(render(CartSummary,{pricing}).includes('✓ Precio mayorista desbloqueado'))
  assert(html.includes('width:100%'))
  assert(html.includes('aria-valuenow="100"'))
  assert(html.includes(`Ahorrás ${formatCurrency(pricing.wholesaleSavings)}`))
})
test('missing wholesale explains retail without bar or misleading amount remaining', () => {
  const pricing=calculateCartPricing([{...item,priceWholesale:null}],policy)
  const html=render(CartPricingStatus,{pricing})
  assert(html.includes('solo tienen precio minorista'))
  assert(!html.includes('progressbar'))
  assert(!html.includes('Te faltan'))
  assert.equal(render(CartPricingStatus,{pricing:calculateCartPricing([],policy)}),'')
  assert.equal(render(CartPricingStatus,{pricing:calculateCartPricing([item],{...policy,wholesaleEnabled:false})}),'')
})

const clarityItems = [
  {...item, priceSale:7000, priceWholesale:4680},
  {...item, idProduct:2, slug:'dos', name:'Dos', priceSale:1950, priceWholesale:1690},
]
test('retail summary presents actual total before separated wholesale progress using the concrete fixture', () => {
  const pricing = calculateCartPricing(clarityItems, policy)
  const html = render(CartSummary,{pricing})
  assert.equal(pricing.effectiveSubtotal,8950)
  assert.equal(pricing.wholesaleCandidate,6370)
  assert.equal(pricing.wholesaleAmountRemaining,43630)
  const total = html.indexOf(formatCurrency(8950))
  const access = html.indexOf('Acceso mayorista')
  const candidate = html.indexOf(formatCurrency(6370))
  assert(total > html.indexOf('Total actual'))
  assert(total < access && access < candidate)
  assert(html.includes(`${formatCurrency(6370)} / ${formatCurrency(50000)}`))
  assert(html.includes(`Te faltan ${formatCurrency(43630)}`))
  assert(html.includes('El progreso se calcula usando los precios mayoristas de los productos de tu carrito.'))
  assert(html.includes('en valor mayorista'))
  assert.equal((html.match(/aria-live="polite"/g)||[]).length,1)
  assert(!/subtotal potencial|candidato mayorista|wholesaleCandidate|precio teórico/.test(html))
})
test('wholesale summary prioritizes unlocked benefit, total and savings before the full bar', () => {
  const pricing = calculateCartPricing([{...item,quantity:3}],policy)
  const html = render(CartSummary,{pricing})
  const unlocked=html.indexOf('✓ Precio mayorista desbloqueado'),total=html.indexOf('Total mayorista'),savings=html.indexOf('Ahorrás'),bar=html.indexOf('role="progressbar"')
  assert(unlocked>=0 && unlocked<total && total<savings && savings<bar)
  assert(html.includes(formatCurrency(pricing.effectiveSubtotal)))
  assert(html.includes(formatCurrency(pricing.wholesaleSavings)))
  assert(html.includes('aria-valuenow="100"'))
  assert(!html.includes('Acceso mayorista'))
  assert(!html.includes('El progreso se calcula usando'))
  assert(!html.includes(`${formatCurrency(75000)} / ${formatCurrency(50000)}`))
})
test('missing wholesale and disabled summaries retain actual retail total without misleading progress', () => {
  for (const pricing of [calculateCartPricing([{...item,priceWholesale:null}],policy),calculateCartPricing([item],{...policy,wholesaleEnabled:false})]) {
    const html=render(CartSummary,{pricing})
    assert(html.includes('Total actual'))
    assert(html.includes(formatCurrency(pricing.effectiveSubtotal)))
    assert(!html.includes('progressbar'))
    assert(!html.includes('Acceso mayorista'))
    assert(!html.includes('Te faltan'))
    assert(!html.includes('Calculado con precios mayoristas'))
  }
  const html=render(CartSummary,{pricing:calculateCartPricing([{...item,priceWholesale:null}],policy)})
  assert(html.indexOf('Total actual')<html.indexOf('solo tienen precio minorista'))
})
test('Side Cart presents actual total before compact progress and retains wholesale success', () => {
  previewItems=clarityItems
  const pricing=calculateCartPricing(previewItems,policy)
  const html=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(CartPreview,{pricing,onNavigate:()=>{}})))
  assert(html.indexOf('Total actual')<html.indexOf('Progreso mayorista'))
  assert(html.includes(formatCurrency(8950)))
  assert(html.includes(`${formatCurrency(6370)} / ${formatCurrency(50000)}`))
  assert(html.includes('Calculado con precios mayoristas.'))
  assert(!html.includes('El progreso se calcula usando'))
  assert.equal((html.match(/aria-live="polite"/g)||[]).length,1)
  previewItems=[{...item,quantity:3}]
  const wholesale=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(CartPreview,{pricing:calculateCartPricing(previewItems,policy),onNavigate:()=>{}})))
  assert(wholesale.indexOf('✓ Precio mayorista desbloqueado')<wholesale.indexOf('Total mayorista'))
  assert(wholesale.indexOf('Total mayorista')<wholesale.indexOf('Ahorrás'))
  assert(wholesale.includes('aria-valuenow="100"'))
})
