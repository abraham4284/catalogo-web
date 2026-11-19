const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function harness() {
  const navigations = [], openStates = [], presentStates = [], filters = []
  let index = 0
  const hooks = {
    useState: () => [['search', () => {}], [true, value => openStates.push(value)], [true, value => presentStates.push(value)]][index++],
    useRef: value => ({ current: value }),
    useEffect: () => {},
  }
  const source = fs.readFileSync(path.resolve(__dirname, '../src/features/catalog/components/CatalogQuickActions.tsx'), 'utf8')
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const req = name => {
    if (name === 'react') return hooks
    if (name === 'react-dom') return { createPortal: node => node }
    if (name === 'react-router-dom') return { Link: 'a', useNavigate: () => href => navigations.push(href) }
    if (name === '@base-ui/react/dialog') return { Dialog: new Proxy({}, { get: (_, name) => 'dialog-' + name }) }
    if (name.endsWith('/useCatalogQuickVisibility')) return { useCatalogQuickVisibility: () => true }
    if (name.endsWith('/catalog-url')) return { getCatalogHref: value => { filters.push(value); return '/submitted-search' } }
    if (name === './QuickCatalogSearch') return { QuickCatalogSearch: 'quick-search' }
    if (name.startsWith('@phosphor-icons/')) return { [name.split('/').at(-1) + 'Icon']: 'icon' }
    return require(name)
  }
  const module = { exports: {} }
  new Function('require', 'module', 'exports', 'document', output)(req, module, module.exports, { body: {} })
  const tree = module.exports.CatalogQuickActions({ categories: [], categoryStatus: 'success', filters: { page:2, categorySlug:'perfumeria', search:'old' }, productsRef: { current: null } })
  function find(node, type) {
    if (Array.isArray(node)) return node.map(child => find(child, type)).find(Boolean)
    if (!node?.props) return undefined
    return node.type === type ? node : find(node.props.children, type)
  }
  return { root: find(tree, 'dialog-Root'), search: find(tree, 'quick-search'), navigations, openStates, presentStates, filters }
}

test('search navigation waits for Base UI exit completion and is consumed only once', () => {
  const h = harness()
  h.search.props.onSearch('term', 'perfumeria')
  assert.deepEqual(h.openStates, [false])
  assert.deepEqual(h.filters, [{ page:1, categorySlug:'perfumeria', search:'term' }])
  assert.deepEqual(h.navigations, [])
  h.root.props.onOpenChangeComplete(true)
  assert.deepEqual(h.navigations, [])
  h.root.props.onOpenChangeComplete(false)
  h.root.props.onOpenChangeComplete(false)
  assert.deepEqual(h.navigations, ['/submitted-search'])
})

test('closing without submit never navigates and global submit preserves category removal', () => {
  const h = harness()
  h.root.props.onOpenChange(false)
  h.root.props.onOpenChangeComplete(false)
  assert.deepEqual(h.navigations, [])
  assert.deepEqual(h.presentStates, [false])
  const global = harness()
  global.search.props.onSearch('global', undefined)
  assert.equal(global.filters[0].categorySlug, undefined)
  assert.equal(global.filters[0].page, 1)
  assert.deepEqual(global.navigations, [])
  global.root.props.onOpenChangeComplete(false)
  assert.equal(global.navigations.length, 1)
})
