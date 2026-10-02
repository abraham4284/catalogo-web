const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function loadCart() {
  const cache = new Map()
  const root = path.resolve(__dirname, '../src/features/cart')
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    const localRequire = (specifier) => specifier.startsWith('.')
      ? load(path.resolve(path.dirname(filename), `${specifier}.ts`)) : require(specifier)
    new Function('require', 'module', 'exports', output)(localRequire, module, module.exports)
    return module.exports
  }
  return (relative) => load(path.join(root, `${relative}.ts`))
}

const snapshot = { idProduct: 1, name: 'Producto', price: 12.5, imageUrl: '/product.png', available: true, stockAvailable: 5 }
const item = { ...snapshot, quantity: 2 }

test('cart domain, schemas, persistence and real Zustand actions', async (t) => {
  const load = loadCart()
  const { calculateCartLineTotal, calculateCartTotal, calculateCartItemCount, isCartItemAvailable, isCartItemQuantityValid, isCartReadyForInquiry, canIncrementCartItem } = load('domain/cart')
  const { cartItemSchema } = load('schemas/cart.schemas')
  const { parsePersistedCart } = load('store/cart.storage')
  await t.test('derived amounts and empty cart', () => {
    assert.equal(calculateCartLineTotal(item), 25)
    assert.equal(calculateCartTotal([item, { ...item, idProduct: 2, quantity: 3, price: 10 }]), 55)
    assert.equal(calculateCartItemCount([item, { ...item, idProduct: 2, quantity: 3 }]), 5)
    assert.equal(calculateCartTotal([]), 0)
    assert.equal(calculateCartItemCount([]), 0)
  })
  await t.test('safe positive quantities, IDs, names and finite prices', () => {
    for (const quantity of [0, -1, 1.2, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.equal(cartItemSchema.safeParse({ ...item, quantity }).success, false)
    }
    assert.equal(cartItemSchema.safeParse({ ...item, quantity: Number.MAX_SAFE_INTEGER }).success, true)
    for (const invalid of [{ idProduct: 0 }, { idProduct: Number.MAX_SAFE_INTEGER + 1 }, { name: '  ' }, { price: Infinity }, { price: NaN }, { imageUrl: 3 }, { available: 'true' }, { stockAvailable: -1 }, { stockAvailable: 1.5 }]) {
      assert.equal(cartItemSchema.safeParse({ ...item, ...invalid }).success, false)
    }
    assert.equal(cartItemSchema.safeParse({ ...item, imageUrl: null }).success, true)
    assert.equal(cartItemSchema.safeParse({ ...item, available: false, stockAvailable: 0 }).success, true)
  })
  await t.test('persisted data validates version and rejects corruption or duplicates', () => {
    const valid = JSON.stringify({ version: 2, state: { items: [{ ...item, name: ' Producto ', gallery: [] }], total: 999 } })
    assert.deepEqual(parsePersistedCart(valid), { items: [item] })
    for (const raw of [null, '', '{broken', 'null', '[]', JSON.stringify({ version: 1, state: { items: [item] } }), JSON.stringify({ version: 3, state: { items: [item] } }), JSON.stringify({ version: 2, state: { items: [item, item] } }), JSON.stringify({ version: 2, state: { items: [{ ...item, quantity: 0 }] } })]) {
      assert.deepEqual(parsePersistedCart(raw), { items: [] })
    }
    const inconsistent = { ...item, stockAvailable: 0, available: false }
    assert.deepEqual(parsePersistedCart(JSON.stringify({ version: 2, state: { items: [inconsistent] } })), { items: [inconsistent] })
  })
  await t.test('availability, quantity and readiness distinguish stock changes', () => {
    assert.equal(isCartItemAvailable(item), true)
    assert.equal(isCartItemQuantityValid(item), true)
    assert.equal(isCartReadyForInquiry([item]), true)
    assert.equal(isCartReadyForInquiry([]), false)
    for (const unavailable of [{ ...item, stockAvailable: 0 }, { ...item, available: false }]) {
      assert.equal(isCartItemAvailable(unavailable), false)
      assert.equal(isCartReadyForInquiry([item, unavailable]), false)
      assert.equal(canIncrementCartItem(unavailable), false)
    }
    const excess = { ...item, quantity: 4, stockAvailable: 2 }
    assert.equal(isCartItemQuantityValid(excess), false)
    assert.equal(isCartReadyForInquiry([excess]), false)
    assert.equal(canIncrementCartItem(excess), false)
    assert.equal(canIncrementCartItem({ ...item, quantity: 5 }), false)
  })

  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const values = new Map()
  let writes = 0
  const memoryStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { writes++; values.set(key, value) },
    removeItem: (key) => values.delete(key),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true })
  try {
    await t.test('add refreshes all snapshot fields and refresh rehydrates image', () => {
      const store = loadCart()('store/cart.store').useCartStore
      store.getState().addItem(snapshot)
      assert.equal(store.getState().items[0].quantity, 1)
      const updated = { ...snapshot, name: 'Nuevo nombre', price: 20, imageUrl: '/updated.png', stockAvailable: 3 }
      store.getState().addItem(updated)
      assert.deepEqual(store.getState().items, [{ ...updated, quantity: 2 }])
      store.getState().incrementItem(1)
      assert.equal(store.getState().items[0].quantity, 3)
      const saved = JSON.parse(values.get('catalogo-web-cart'))
      assert.equal(saved.version, 2)
      assert.deepEqual(Object.keys(saved.state), ['items'])
      assert.equal(saved.state.items[0].imageUrl, '/updated.png')
      const refreshed = loadCart()('store/cart.store').useCartStore
      assert.deepEqual(refreshed.getState().items, store.getState().items)
      refreshed.getState().decrementItem(1)
      refreshed.getState().decrementItem(1)
      refreshed.getState().decrementItem(1)
      assert.equal(refreshed.getState().items[0].quantity, 1)
      refreshed.getState().addItem({ ...snapshot, idProduct: 2 })
      refreshed.getState().removeItem(1)
      assert.equal(refreshed.getState().items[0].idProduct, 2)
      refreshed.getState().clearCart()
      assert.deepEqual(loadCart()('store/cart.store').useCartStore.getState().items, [])
    })
    await t.test('stock caps additions and increments, including one remaining unit', () => {
      values.clear()
      const store = loadCart()('store/cart.store').useCartStore
      store.getState().addItem({ ...snapshot, stockAvailable: 1 })
      store.getState().incrementItem(1)
      store.getState().addItem({ ...snapshot, stockAvailable: 1, name: 'Actualizado' })
      assert.equal(store.getState().items[0].quantity, 1)
      assert.equal(store.getState().items[0].name, 'Actualizado')
      store.getState().addItem(snapshot)
      for (let index = 0; index < 10; index++) store.getState().incrementItem(1)
      store.getState().addItem(snapshot)
      assert.equal(store.getState().items[0].quantity, 5)
      store.getState().addItem({ ...snapshot, idProduct: 0 })
      assert.equal(store.getState().items.length, 1)
      values.set('catalogo-web-cart', '{broken')
      assert.deepEqual(loadCart()('store/cart.store').useCartStore.getState().items, [])
    })
    await t.test('unavailable products and stock zero cannot be added', () => {
      values.clear()
      const store = loadCart()('store/cart.store').useCartStore
      store.getState().addItem({ ...snapshot, stockAvailable: 0 })
      store.getState().addItem({ ...snapshot, available: false })
      assert.deepEqual(store.getState().items, [])
    })
    await t.test('reconcile updates snapshots without quantity changes or identical writes', () => {
      values.clear()
      const store = loadCart()('store/cart.store').useCartStore
      store.getState().reconcileItem(snapshot)
      assert.deepEqual(store.getState().items, [])
      store.getState().addItem(snapshot)
      store.getState().incrementItem(1)
      store.getState().incrementItem(1)
      store.getState().incrementItem(1)
      const changed = { ...snapshot, name: 'Actualizado', price: 20, imageUrl: null, stockAvailable: 2 }
      store.getState().reconcileItem(changed)
      assert.deepEqual(store.getState().items, [{ ...changed, quantity: 4 }])
      const before = writes
      store.getState().reconcileItem(changed)
      assert.equal(writes, before)
      store.getState().incrementItem(1)
      assert.equal(store.getState().items[0].quantity, 4)
      assert.equal(isCartReadyForInquiry(store.getState().items), false)
      store.getState().decrementItem(1)
      store.getState().decrementItem(1)
      assert.equal(isCartReadyForInquiry(store.getState().items), true)
      store.getState().reconcileItem({ ...changed, available: false, stockAvailable: 0, imageUrl: '/new.png' })
      assert.equal(store.getState().items.length, 1)
      assert.equal(store.getState().items[0].quantity, 2)
      assert.equal(store.getState().items[0].available, false)
      assert.equal(store.getState().items[0].imageUrl, '/new.png')
      store.getState().incrementItem(1)
      assert.equal(store.getState().items[0].quantity, 2)
      assert.equal(isCartReadyForInquiry(store.getState().items), false)
      store.getState().removeItem(1)
      assert.deepEqual(store.getState().items, [])
    })
    await t.test('re-add with lower stock preserves excess quantity for review', () => {
      values.clear()
      const store = loadCart()('store/cart.store').useCartStore
      for (let i = 0; i < 4; i++) store.getState().addItem(snapshot)
      store.getState().addItem({ ...snapshot, stockAvailable: 2 })
      assert.equal(store.getState().items[0].quantity, 4)
      assert.equal(isCartReadyForInquiry(store.getState().items), false)
    })
    await t.test('legacy v1 clears safely instead of inventing availability', () => {
      values.set('catalogo-web-cart', JSON.stringify({ version: 1, state: { items: [{ idProduct: 1, name: 'Viejo', price: 10, quantity: 2 }] } }))
      assert.deepEqual(loadCart()('store/cart.store').useCartStore.getState().items, [])
    })
    await t.test('full storage leaves hydrated cart and in-memory actions usable', () => {
      values.set('catalogo-web-cart', JSON.stringify({ version: 2, state: { items: [item] } }))
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: { ...memoryStorage, setItem() { throw new Error('QuotaExceededError') } },
      })
      const store = loadCart()('store/cart.store').useCartStore
      assert.equal(store.getState().items[0].quantity, 2)
      assert.doesNotThrow(() => store.getState().incrementItem(1))
      assert.equal(store.getState().items[0].quantity, 3)
      assert.doesNotThrow(() => store.getState().clearCart())
      assert.deepEqual(store.getState().items, [])
    })
    await t.test('unavailable storage leaves in-memory actions usable', () => {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('denied') } })
      const store = loadCart()('store/cart.store').useCartStore
      assert.doesNotThrow(() => store.getState().addItem(snapshot))
      assert.equal(store.getState().items.length, 1)
      assert.doesNotThrow(() => store.getState().clearCart())
    })
  } finally {
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else delete globalThis.localStorage
  }
})
