const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

// Execute the real page with controlled URL/data and React hook lifetimes.
// Scroll is a DOM side effect, so record it without adding a DOM test dependency.
function pageHarness(initial = '') {
  const refs = [], effects = [], cleanups = [], scrolls = [], frames = new Map()
  let frameId = 0
  let refIndex, effectIndex, pending, query = initial, status = 'loading', focusCalls = 0
  const target = { scrollIntoView: options => scrolls.push(options), focus: () => focusCalls++ }
  const noop = () => null
  const hooks = {
    useRef(value) { const index = refIndex++; return refs[index] ?? (refs[index] = { current: value }) },
    useEffect(callback, deps) {
      const index = effectIndex++, previous = effects[index]
      if (!previous || deps.some((value, i) => !Object.is(value, previous[i]))) pending.push(() => { cleanups[index]?.(); cleanups[index] = callback() })
      effects[index] = deps
    },
  }
  const catalog = {
    WholesaleNotice: noop,
    readCatalogFilters: params => ({ page: Number(params.get('page') || 1), search: params.get('search'), categorySlug: params.get('categoria') }),
    useCatalogListing: () => ({ categories: { status:'success', data:[] }, products: status === 'success' ? { status, data:{items:[],pagination:{totalPages:3,currentPage:Number(new URLSearchParams(query).get('page')||1),totalRecords:0}} } : { status, message:'Error' }, retry:noop }),
    createCatalogSearchParams: () => new URLSearchParams(), getCatalogHref: () => '/productos?page=3',
    CatalogSearch:noop,CategoryFilter:noop,CatalogErrorState:noop,CatalogLoadingState:noop,CatalogEmptyState:noop,ProductGrid:noop,CatalogPaginationControls:noop,
  }
  const filename = path.resolve(__dirname, '../src/pages/catalog/CatalogPage.tsx')
  const output = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
  const module = { exports:{} }
  const req = name => name === 'react' ? hooks : name === 'react-router-dom' ? { Navigate:noop,useSearchParams:()=>[new URLSearchParams(query),noop] } : name === '@/features/catalog' ? catalog : name === '@/app/compositions/ProductCommerceActions' ? {ProductCommerceActions:noop} : require(name)
  new Function('require','module','exports','requestAnimationFrame','cancelAnimationFrame',output)(req,module,module.exports,callback=>{frames.set(++frameId,callback);return frameId},id=>frames.delete(id))
  const flushFrame = () => { const callbacks=[...frames.values()]; frames.clear(); callbacks.forEach(callback=>callback()) }
  function render(nextQuery = query, nextStatus = status, flush = true) {
    query=nextQuery;status=nextStatus;refIndex=0;effectIndex=0;pending=[]
    const tree=module.exports.CatalogPage()
    refs.filter(ref=>ref.current===target).forEach(ref=>{ref.current=null})
    function attach(node) {
      if (Array.isArray(node)) return node.forEach(attach)
      if (!node?.props) return
      if (node.props.ref) node.props.ref.current=target
      attach(node.props.children)
    }
    attach(tree)
    pending.forEach(effect=>effect())
    if (flush) flushFrame()
    return tree
  }
  return {render,scrolls,flushFrame,focusCalls:()=>focusCalls}
}

test('pagination scrolls on 1→2→3→2→1 immediately while loading',()=>{
  const page=pageHarness();page.render()
  assert.equal(page.scrolls.length,0)
  for (const number of [2,3,2,1]) page.render(`page=${number}`,'loading')
  assert.deepEqual(page.scrolls,Array(4).fill({behavior:'auto',block:'start'}))
  assert.equal(page.focusCalls(),0)
})
test('same-page search/category, retry and data completion do not scroll',()=>{
  const page=pageHarness();page.render()
  for (const [query,status] of [['search=uno','loading'],['search=uno','success'],['categoria=perfumes','loading'],['categoria=perfumes','error'],['categoria=perfumes','loading'],['categoria=perfumes','success'],['categoria=perfumes','success']]) page.render(query,status)
  assert.deepEqual(page.scrolls,[])
})
test('filter reset to page one scrolls once without waiting for results',()=>{
  const page=pageHarness('page=3');page.render()
  page.render('search=uno','loading')
  assert.equal(page.scrolls.length,1)
  page.render('search=uno','success')
  assert.equal(page.scrolls.length,1)
})
test('mounting a catalog page, including returning from a product, does not force scroll',()=>{
  for(const query of ['','page=2','page=3']) {
    const page=pageHarness(query);page.render();page.render(query,'success')
    assert.deepEqual(page.scrolls,[])
  }
})
test('invalid-page redirect still scrolls when the URL changes to the valid page',()=>{
  const page=pageHarness('page=99');page.render('page=99','success')
  page.render('page=3','loading')
  assert.deepEqual(page.scrolls,[{behavior:'auto',block:'start'}])
})

test('rapid page changes cancel superseded animation frames',()=>{
  const page=pageHarness();page.render()
  page.render('page=2','loading',false)
  page.render('page=3','loading',false)
  assert.equal(page.scrolls.length,0)
  page.flushFrame()
  assert.deepEqual(page.scrolls,[{behavior:'auto',block:'start'}])
})
