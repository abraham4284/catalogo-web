const assert=require('node:assert/strict'),test=require('node:test'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');const root=path.resolve(__dirname,'../src'),cache=new Map();function load(name){const file=path.resolve(root,name+'.ts');if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const req=s=>s.startsWith('@/')?load(s.slice(2)):s.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),s))):require(s);new Function('require','module','exports',output)(req,m,m.exports);return m.exports}

const { calculateCartPricing: pricing, hasValidWholesalePrice } = load('features/cart/domain/pricing')
const policy = { wholesaleEnabled: true, wholesaleMinimumAmount: 50000 }
const item = { idProduct: 1, slug: 'uno', name: 'Uno', priceSale: 40000, priceWholesale: 25000, quantity: 1, stockAvailable: 20, availabilityStatus: 'in_stock', imageUrl: null }

test('disabled and unavailable policy retain retail, and empty never qualifies', () => {
  for (const rule of [undefined, { ...policy, wholesaleEnabled: false }]) {
    const result = pricing([{ ...item, quantity: 3 }], rule)
    assert.equal(result.effectivePricingType, 'RETAIL')
    assert.equal(result.effectiveSubtotal, 120000)
    assert.equal(result.wholesaleAmountRemaining, 0)
    assert.equal(result.wholesaleSavings, 0)
  }
  assert.equal(pricing([], { ...policy, wholesaleMinimumAmount: 0 }).effectivePricingType, 'RETAIL')
})
test('threshold uses wholesale candidate, even when retail already exceeds minimum', () => {
  const result = pricing([{ ...item, priceSale: 70000 }], policy)
  assert.equal(result.retailSubtotal, 70000)
  assert.equal(result.wholesaleCandidate, 25000)
  assert.equal(result.wholesaleAmountRemaining, 25000)
  assert.equal(result.effectivePricingType, 'RETAIL')
  assert.equal(result.effectiveSubtotal, 70000)
})
test('exact and above threshold switch all lines and expose savings', () => {
  for (const quantity of [2, 3]) {
    const result = pricing([{ ...item, quantity }], policy)
    assert.equal(result.effectivePricingType, 'WHOLESALE')
    assert.equal(result.effectiveSubtotal, 25000 * quantity)
    assert.equal(result.lines[0].unitPrice, 25000)
    assert.equal(result.lines[0].lineTotal, 25000 * quantity)
    assert.equal(result.wholesaleSavings, 15000 * quantity)
    assert.equal(result.wholesaleAmountRemaining, 0)
  }
})
test('mixed categories combine, and removing or reducing returns immediately to retail', () => {
  const a = { ...item, category: 'tecnologia' }, b = { ...item, idProduct: 2, slug: 'dos', category: 'perfumeria' }
  assert.equal(pricing([a, b], policy).effectivePricingType, 'WHOLESALE')
  assert.equal(pricing([a, b, {...b,idProduct:3,slug:'tres',category:'maquillaje'}], policy).effectiveSubtotal, 75000)
  const lower = pricing([a], policy)
  assert.equal(lower.effectivePricingType, 'RETAIL')
  assert.equal(lower.lines[0].unitPrice, a.priceSale)
  assert.equal(lower.wholesaleAmountRemaining, 25000)
  assert.equal(pricing([{ ...a, quantity: 2 }], policy).effectivePricingType, 'WHOLESALE')
  assert.equal(pricing([{ ...a, quantity: 1 }], policy).effectivePricingType, 'RETAIL')
})
test('one missing or invalid wholesale price blocks whole-cart eligibility without retail fallback within wholesale', () => {
  for (const value of [null, undefined, 0, -1, NaN, Infinity]) {
    assert.equal(hasValidWholesalePrice(value), false)
    const result = pricing([{ ...item, quantity: 3 }, { ...item, idProduct: 2, priceWholesale: value }], policy)
    assert.equal(result.effectivePricingType, 'RETAIL')
    assert.equal(result.allItemsHaveWholesalePrice, false)
    assert.equal(result.effectiveSubtotal, 160000)
    assert.equal(result.wholesaleAmountRemaining, 0)
    assert.equal(result.wholesaleSavings, 0)
    assert(result.lines.every(line => line.unitPrice === item.priceSale))
  }
})
test('decimal line totals round half up before sum, without binary tie errors', () => {
  const { moneyLineCents } = load('shared/utils/money')
  for (const [unit, quantity, cents] of [[1.005,1,101],[1.005,3,302],[2.675,1,268],[0.335,3,101],[1e-7,1,0],[1e3,2,200000]]) assert.equal(moneyLineCents(unit,quantity),cents)
  const result = pricing([1,2,3].map(idProduct => ({ ...item, idProduct, priceSale: 1, priceWholesale: 0.335 })), { ...policy, wholesaleMinimumAmount: 1.02 })
  assert.equal(result.wholesaleCandidate,1.02)
  assert.equal(result.effectivePricingType,'WHOLESALE')
  assert.equal(result.effectiveSubtotal,1.02)
  assert.equal(result.wholesaleSavings,1.98)
})
test('v3 migration preserves identity and quantities but never invents wholesale data', () => {
  const { parsePersistedCart: parse } = load('features/cart/store/cart.storage')
  const { priceSale, priceWholesale, ...rest } = item
  const legacy = { ...rest, price: priceSale, priceWholesale: 1 }
  assert.deepEqual(parse(JSON.stringify({ version:3, state:{items:[legacy]} })), { items:[{...rest,priceSale,priceWholesale:null}] })
  for (const value of [null,'{bad',JSON.stringify({version:8,state:{items:[item]}}),JSON.stringify({version:3,state:{items:[legacy,legacy]}}),JSON.stringify({version:3,state:{items:[legacy,{...legacy,idProduct:2}]}})]) assert.deepEqual(parse(value),{items:[]})
  assert.deepEqual(parse(JSON.stringify({version:4,state:{items:[{...item,priceWholesale:null}]}})),{items:[{...item,priceWholesale:null}]})
})
test('revalidation dual prices change tier while preserving quantity', async () => {
  const { revalidateCartProducts } = load('app/compositions/cart-catalog-revalidation')
  const original = { ...item, quantity: 2 }
  const result = await revalidateCartProducts([original], async () => ({...item, priceSale:45000,priceWholesale:20000}), new AbortController().signal)
  const updated = { ...result.snapshots[0], quantity: original.quantity }
  assert.equal(updated.quantity,2)
  assert.equal(updated.priceSale,45000)
  assert.equal(updated.priceWholesale,20000)
  assert.equal(pricing([original],policy).effectivePricingType,'WHOLESALE')
  assert.equal(pricing([updated],policy).effectivePricingType,'RETAIL')
  assert.equal(pricing([updated],policy).effectiveSubtotal,90000)
})
test('WhatsApp receives final retail/wholesale amounts without deciding eligibility', () => {
  const { buildWhatsAppCheckoutMessage: build } = load('features/whatsapp/domain/whatsapp-message')
  const { formatCurrency } = load('shared/utils/format-currency')
  for (const quantity of [1,2]) {
    const result = pricing([{...item,quantity}],policy)
    const items = result.lines.map(({item,unitPrice,lineTotal})=>({name:item.name,quantity:item.quantity,unitPrice,lineTotal}))
    const message = build(items,result.effectivePricingType)
    assert(message.includes(quantity===1?'Tipo: Compra minorista':'Tipo: Compra mayorista'))
    assert(message.includes(formatCurrency(result.effectiveSubtotal)))
    assert(message.includes(formatCurrency(result.lines[0].unitPrice)))
    assert.equal(message.includes('cumple el mínimo'),quantity===2)
  }
  assert.throws(()=>build([{name:'Uno',quantity:1,unitPrice:10,lineTotal:99}]))
})
