const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

test('quick visibility batches scroll, remeasures rows on resize and cleans up pending work', () => {
  const frames = new Map(), events = new Map(), viewportEvents = new Map(), states = []
  let cleanup, resize, disconnected = false, id = 0, queries = 0, scrollY = 0
  let tops = [100, 100, 700, 700]
  const grid = { querySelectorAll: () => {
    queries++
    return tops.map(top => ({ parentElement: { getBoundingClientRect: () => ({ top: top - scrollY }) } }))
  } }
  const products = { querySelector: () => ({ closest: () => grid }) }
  const window = {
    innerHeight: 800,
    addEventListener: (type, callback, options) => { if (type === 'scroll') assert.equal(options.passive, true); events.set(type, callback) },
    removeEventListener: type => events.delete(type),
    visualViewport: { height: 800, addEventListener: (type, callback) => viewportEvents.set(type, callback), removeEventListener: type => viewportEvents.delete(type) },
  }
  function compile(file, require, globals = {}) {
    const module = { exports: {} }
    const source = fs.readFileSync(path.resolve(__dirname, '../src/features/catalog', file), 'utf8')
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
    new Function('require', 'module', 'exports', ...Object.keys(globals), output)(require, module, module.exports, ...Object.values(globals))
    return module.exports
  }
  const utils = compile('utils/catalog-quick-visibility.ts', require)
  const hooks = { useState: () => [false, value => states.push(value)], useEffect: effect => { cleanup = effect() } }
  const { useCatalogQuickVisibility } = compile('hooks/useCatalogQuickVisibility.ts', name => name === 'react' ? hooks : utils, {
    window,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id },
    cancelAnimationFrame: frame => frames.delete(frame),
    ResizeObserver: class { constructor(callback) { resize = callback } observe(target) { assert.equal(target, products) } disconnect() { disconnected = true } },
  })
  const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()) }
  useCatalogQuickVisibility({ current: products })
  flush(); assert.equal(states.at(-1), false); assert.equal(queries, 1)
  scrollY = 200
  for (let i = 0; i < 100; i++) events.get('scroll')()
  assert.equal(frames.size, 1)
  flush(); assert.equal(states.at(-1), true); assert.equal(queries, 1)
  scrollY = 0; events.get('scroll')(); flush(); assert.equal(states.at(-1), false)
  tops = [100, 100, 100, 100]; resize(); flush()
  scrollY = 1000; events.get('scroll')(); flush(); assert.equal(states.at(-1), false)
  assert.equal(queries, 2)
  events.get('scroll')(); cleanup()
  assert.equal(frames.size, 0); assert.equal(events.size, 0); assert.equal(viewportEvents.size, 0); assert.equal(disconnected, true)
})
