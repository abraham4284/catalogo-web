const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function loadWhatsApp() {
  const cache = new Map()
  const runtimeEnv = {}
  const root = path.resolve(__dirname, '../src')
  function load(relative) {
    const filename = path.resolve(root, `${relative}.ts`)
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env', 'runtimeEnv')
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    const localRequire = (specifier) => {
      if (specifier.startsWith('@/')) return load(specifier.slice(2))
      if (specifier.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), specifier)))
      return require(specifier)
    }
    new Function('require', 'module', 'exports', 'runtimeEnv', output)(localRequire, module, module.exports, runtimeEnv)
    return module.exports
  }
  return { load, runtimeEnv }
}

test('message has quantities, prices, totals and confirmation without mutating items', () => {
  const { load } = loadWhatsApp()
  const { buildWhatsAppCheckoutMessage: build } = load('features/whatsapp/domain/whatsapp-message')
  const { formatCurrency } = load('shared/utils/format-currency')
  const items = Object.freeze([
    Object.freeze({ name: ' Producto\nEspecial\t& café ', price: 10000, quantity: 2 }),
    Object.freeze({ name: 'Producto B', price: 5000, quantity: 1 }),
  ])
  const message = build(items)
  assert.ok(message.includes(`- 2 x Producto Especial & café — ${formatCurrency(10000)} c/u — subtotal ${formatCurrency(20000)}`))
  assert.ok(message.includes(`- 1 x Producto B — ${formatCurrency(5000)} c/u — subtotal ${formatCurrency(5000)}`))
  assert.ok(message.includes(`Total estimado: ${formatCurrency(25000)}`))
  assert.ok(message.includes('confirmar precio y disponibilidad'))
  assert.equal(message.split('\n').filter((line) => line.startsWith('- ')).length, 2)
  assert.equal(build(items), message)
  assert.equal(items[0].name, ' Producto\nEspecial\t& café ')
  assert.ok(build([items[1]]).includes(`Total estimado: ${formatCurrency(5000)}`))
})

test('empty or invalid message inputs do not produce a checkout', () => {
  const { load } = loadWhatsApp()
  const { buildWhatsAppCheckoutMessage: build } = load('features/whatsapp/domain/whatsapp-message')
  assert.throws(() => build([]))
  for (const item of [
    { name: '  ', price: 10, quantity: 1 },
    { name: 'Producto', price: Infinity, quantity: 1 },
    { name: 'Producto', price: 10, quantity: 0 },
    { name: 'Producto', price: 10, quantity: 1.5 },
  ]) assert.throws(() => build([item]))
})

test('wa.me URL encodes special characters into exactly one text parameter', () => {
  const { load } = loadWhatsApp()
  const { buildWhatsAppUrl: build } = load('features/whatsapp/utils/whatsapp-url')
  const message = 'Café & té?\nPrecio $10 + 20% #consulta / ñ 😀'
  const phone = '5493811234567' // Documentary fixture only; never opened or sent.
  const href = build(phone, message)
  assert.equal(href, `https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
  const url = new URL(href)
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.searchParams.get('text'), message)
  assert.deepEqual([...url.searchParams.keys()], ['text'])
  for (const invalid of ['', '+5493811234567', '549 3811234567', '1234567', '1'.repeat(16), '../unsafe']) {
    assert.throws(() => build(invalid, message))
  }
})

test('number configuration is lazy, strict and unavailable configuration is safe', () => {
  const { load, runtimeEnv } = loadWhatsApp()
  const { getWhatsAppNumber } = load('config/env')
  const { getWhatsAppCheckoutHref } = load('features/whatsapp/utils/whatsapp-checkout')
  const items = [{ name: 'Producto', price: 10, quantity: 2 }]
  assert.throws(() => getWhatsAppNumber())
  assert.equal(getWhatsAppCheckoutHref(items), undefined)
  for (const number of ['', '+5493811234567', '549381-1234567', ' 5493811234567 ', '1234567', '1'.repeat(16)]) {
    runtimeEnv.VITE_WHATSAPP_NUMBER = number
    assert.throws(() => getWhatsAppNumber())
    assert.equal(getWhatsAppCheckoutHref(items), undefined)
  }
  runtimeEnv.VITE_WHATSAPP_NUMBER = '5493811234567'
  assert.equal(getWhatsAppNumber(), '5493811234567')
  const before = structuredClone(items)
  assert.ok(getWhatsAppCheckoutHref(items).startsWith('https://wa.me/5493811234567?text='))
  assert.deepEqual(items, before)
  assert.equal(getWhatsAppCheckoutHref([]), undefined)
})

test('product inquiry normalizes names and includes published price without stock or IDs', () => {
  const { load } = loadWhatsApp()
  const { buildWhatsAppProductInquiryMessage: build } = load('features/whatsapp/domain/whatsapp-product-inquiry')
  const { formatCurrency } = load('shared/utils/format-currency')
  const product = Object.freeze({ name: '  Producto\n& café 😀 ', price: 35000, available: true, stockAvailable: 9876, idProduct: 6543 })
  const message = build(product)
  assert.ok(message.includes('Producto & café 😀'))
  assert.ok(message.includes(`Precio publicado: ${formatCurrency(35000)}`))
  assert.ok(message.includes('confirmar precio y disponibilidad'))
  for (const forbidden of ['stockAvailable', '9876', '6543', 'depósito', 'idProduct']) assert.equal(message.includes(forbidden), false)
  const unavailable = build({ ...product, available: false })
  assert.ok(unavailable.includes('consultar por la disponibilidad de Producto & café 😀'))
  assert.ok(unavailable.includes('Precio publicado:'))
  assert.equal(product.name, '  Producto\n& café 😀 ')
  assert.throws(() => build({ ...product, name: '  ' }))
  assert.throws(() => build({ ...product, price: Infinity }))
})

test('individual inquiry URL encodes one text parameter and tolerates missing configuration', () => {
  const { load, runtimeEnv } = loadWhatsApp()
  const { getWhatsAppProductInquiryHref: href } = load('features/whatsapp/utils/whatsapp-product-inquiry')
  const { buildWhatsAppProductInquiryMessage: message } = load('features/whatsapp/domain/whatsapp-product-inquiry')
  const product = { name: 'Café & té? #1 + 😀', price: 50, available: true }
  assert.equal(href(product), undefined)
  runtimeEnv.VITE_WHATSAPP_NUMBER = 'invalid'
  assert.equal(href(product), undefined)
  runtimeEnv.VITE_WHATSAPP_NUMBER = '5493811234567'
  for (const available of [true, false]) {
    const input = { ...product, available }
    const url = new URL(href(input))
    assert.equal(url.origin, 'https://wa.me')
    assert.equal(url.searchParams.get('text'), message(input))
    assert.deepEqual([...url.searchParams.keys()], ['text'])
  }
})
