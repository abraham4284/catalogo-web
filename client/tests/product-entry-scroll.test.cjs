const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function harness(readyState = 'complete') {
  let dependencies
  let cleanup
  let frameId = 0
  const frames = new Map()
  const events = new Map()
  const scrolls = []
  const browser = {
    history: { scrollRestoration: 'auto' },
    scrollTo: options => scrolls.push(options),
    addEventListener: (type, callback) => events.set(type, callback),
    removeEventListener: type => events.delete(type),
  }
  const hooks = {
    useLayoutEffect(callback, next) {
      if (!dependencies || next.some((value, index) => value !== dependencies[index])) {
        cleanup?.()
        cleanup = callback()
      }
      dependencies = next
    },
  }
  const source = fs.readFileSync(path.resolve(__dirname, '../src/app/compositions/useProductEntryScroll.ts'), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame', output)(
    () => hooks, module, module.exports, browser, { readyState },
    callback => { frames.set(++frameId, callback); return frameId }, id => frames.delete(id),
  )
  return {
    ...module.exports, browser, events, scrolls,
    flush() { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()) },
    unmount() { cleanup?.() },
  }
}

test('product entry scroll runs once per navigation and ignores same-view rerenders and other routes', () => {
  const h = harness()
  h.useProductEntryScroll('/productos/uno', 'a')
  assert.equal(h.browser.history.scrollRestoration, 'manual')
  h.flush()
  h.useProductEntryScroll('/productos/uno', 'a')
  h.flush()
  assert.equal(h.scrolls.length, 1)
  assert.equal(h.browser.history.scrollRestoration, 'manual')
  h.useProductEntryScroll('/productos/dos', 'b')
  h.flush()
  h.useProductEntryScroll('/productos', 'c')
  h.flush()
  assert.deepEqual(h.scrolls, Array(2).fill({ top: 0, left: 0, behavior: 'instant' }))
  h.useProductEntryScroll('/productos/dos', 'back')
  h.flush()
  assert.equal(h.scrolls.length, 3)
  assert.equal(h.isProductDetailPath('/productos'), false)
  assert.equal(h.isProductDetailPath('/contacto'), false)
})

test('product entry cancels superseded frames and restores native history settings', () => {
  const h = harness()
  h.useProductEntryScroll('/productos/uno', 'a')
  h.useProductEntryScroll('/contacto', 'b')
  h.flush()
  assert.equal(h.scrolls.length, 0)
  assert.equal(h.browser.history.scrollRestoration, 'auto')
  h.useProductEntryScroll('/productos/dos', 'c')
  h.unmount()
  h.flush()
  assert.equal(h.scrolls.length, 0)
})

test('native restoration stays suspended during a product view and returns when leaving', () => {
  const h = harness('interactive')
  h.useProductEntryScroll('/productos/uno', 'initial')
  h.flush()
  assert.equal(h.browser.history.scrollRestoration, 'manual')
  h.useProductEntryScroll('/productos/uno', 'initial')
  h.flush()
  assert.equal(h.scrolls.length, 1)
  h.unmount()
  assert.equal(h.browser.history.scrollRestoration, 'auto')
  assert.equal(h.events.size, 0)
})
