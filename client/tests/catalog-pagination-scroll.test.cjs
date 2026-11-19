const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

// Execute the real page with controlled URL/data and React hook lifetimes.
// Scroll is a DOM side effect, so record it without adding a DOM test dependency.
function pageHarness(initial = '', items = []) {
  const refs = [], effects = [], callbacks = [], cleanups = [], scrolls = [], searches = [], frames = new Map()
  let frameId = 0, key = 0, navigationType = 'POP'
  const documentScrolls = []
  let refIndex, effectIndex, pending, query = initial, status = 'loading', focusCalls = 0
  const target = { scrollIntoView: options => scrolls.push(options), focus: () => focusCalls++ }
  const noop = () => null
  const hooks = {
    useRef(value) { const index = refIndex++; return refs[index] ?? (refs[index] = { current: value }) },
    useEffect(callback, deps) {
      const index = effectIndex++, previous = effects[index]
      if (!previous || deps.some((value, i) => !Object.is(value, previous[i]))) pending.push(() => { cleanups[index]?.(); cleanups[index] = callback() })
      callbacks[index] = callback
      effects[index] = deps
    },
  }
  const catalog = {
    WholesaleNotice: noop,
    readCatalogFilters: params => ({ page: Number(params.get('page') || 1), search: params.get('search'), categorySlug: params.get('categoria') }),
    useCatalogListing: () => ({ categories: { status:'success', data:[] }, products: status === 'success' ? { status, data:{items,pagination:{totalPages:3,currentPage:Number(new URLSearchParams(query).get('page')||1),totalRecords:items.length}} } : { status, message:'Error' }, retry:noop }),
    createCatalogSearchParams: filters => { searches.push(filters); return new URLSearchParams() }, getCatalogHref: () => '/productos?page=3',
    CatalogSearch:()=>null,CategoryFilter:noop,CatalogErrorState:noop,CatalogLoadingState:noop,CatalogEmptyState:noop,ProductGrid:()=>null,CatalogPaginationControls:noop,
  }
  const filename = path.resolve(__dirname, '../src/pages/catalog/CatalogPage.tsx')
  const output = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
  const module = { exports:{} }
  const req = name => name === 'react' ? hooks : name === 'react-router-dom' ? { Navigate:noop,useLocation:()=>({key:String(key)}),useNavigationType:()=>navigationType,useSearchParams:()=>[new URLSearchParams(query),noop] } : name === '@/features/catalog' ? catalog : name === '@/app/compositions/ProductCommerceActions' ? {ProductCommerceActions:noop} : name === '@/app/compositions/QuickCatalogActions' ? {QuickCatalogActions:noop} : name === '@/features/whatsapp/utils/whatsapp-general-inquiry' ? {getWhatsAppWholesaleInquiryHref:noop} : require(name)
  new Function('require','module','exports','requestAnimationFrame','cancelAnimationFrame','window',output)(req,module,module.exports,callback=>{frames.set(++frameId,callback);return frameId},id=>frames.delete(id),{scrollTo:options=>documentScrolls.push(options)})
  const flushFrame = () => { const callbacks=[...frames.values()]; frames.clear(); callbacks.forEach(callback=>callback()) }
  function render(nextQuery = query, nextStatus = status, flush = true, action) {
    if (nextQuery !== query) { key++; navigationType = action ?? 'PUSH' }
    else if (action) { key++; navigationType = action }
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
  return {render,scrolls,documentScrolls,searches,catalog,flushFrame,replayEffects:()=>{cleanups.forEach(cleanup=>cleanup?.());callbacks.forEach((callback,index)=>{cleanups[index]=callback()})},focusCalls:()=>focusCalls}
}

function findComponent(node, component) {
  if (Array.isArray(node)) return node.map(child=>findComponent(child,component)).find(Boolean)
  if (!node?.props) return undefined
  return node.type === component ? node : findComponent(node.props.children,component)
}

test('submitting a search resets page one and preserves the selected category',()=>{
  const page=pageHarness('page=3&categoria=auriculares&search=anterior')
  const tree=page.render()
  findComponent(tree,page.catalog.CatalogSearch).props.onSearch('bluetooth')
  assert.deepEqual(page.searches,[{page:1,search:'bluetooth',categorySlug:'auriculares'}])
})

test('clearing search resets page one without removing the category',()=>{
  const page=pageHarness('page=2&categoria=auriculares&search=bluetooth')
  const tree=page.render()
  findComponent(tree,page.catalog.CatalogSearch).props.onSearch('')
  assert.deepEqual(page.searches,[{page:1,search:'',categorySlug:'auriculares'}])
})

test('catalog page forwards category matches in backend order even without matching product names',()=>{
  const items=[{name:'Bluetooth Gamer G11'},{name:'TWS M10'},{name:'Lenovo LP40'}]
  const page=pageHarness('search=auriculares',items)
  const tree=page.render('search=auriculares','success')
  assert.strictEqual(findComponent(tree,page.catalog.ProductGrid).props.products,items)
})

test('pagination scrolls on 1→2→3→2→1 immediately while loading',()=>{
  const page=pageHarness();page.render()
  assert.equal(page.scrolls.length,0)
  for (const number of [2,3,2,1]) page.render(`page=${number}`,'loading')
  assert.deepEqual(page.scrolls,Array(4).fill({behavior:'auto',block:'start'}))
  assert.equal(page.focusCalls(),0)
})
test('category scrolls document once; search, retries and data completion do not repeat it',()=>{
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


test('category changes and clearing from page three reset document once instead of pagination scroll', () => {
 const page = pageHarness('page=3&categoria=uno&search=term'); page.render()
 for (const query of ['categoria=dos&search=term', 'categoria=tres&search=term', 'search=term']) {
  page.render(query, 'loading'); page.render(query, 'success')
 }
 assert.deepEqual(page.documentScrolls, Array(3).fill({ top:0, left:0, behavior:'instant' }))
 assert.deepEqual(page.scrolls, [])
})

test('entering catalog by PUSH starts at document top while initial load and POP preserve history', () => {
 const entry = pageHarness('categoria=uno'); entry.render(undefined, undefined, true, 'PUSH')
 assert.equal(entry.documentScrolls.length, 1)
 entry.render('categoria=uno', 'success'); assert.equal(entry.documentScrolls.length, 1)
 const history = pageHarness('categoria=uno'); history.render()
 history.render('categoria=dos&page=2', 'success', true, 'POP')
 assert.deepEqual(history.documentScrolls, []); assert.deepEqual(history.scrolls, [])
 history.render('categoria=tres', 'loading'); assert.equal(history.documentScrolls.length, 1)
})

test('superseded category reset is canceled and same URL data refresh cannot reset scroll', () => {
 const page = pageHarness(); page.render()
 page.render('categoria=uno', 'loading', false)
 page.render('categoria=dos', 'loading', false)
 page.flushFrame(); assert.equal(page.documentScrolls.length, 1)
 page.render('categoria=dos', 'success'); assert.equal(page.documentScrolls.length, 1)
})


test('Strict Mode effect replay reschedules a canceled category entry frame', () => {
 const page = pageHarness('categoria=uno')
 page.render(undefined, undefined, false, 'PUSH')
 page.replayEffects(); page.flushFrame()
 assert.deepEqual(page.documentScrolls, [{ top:0, left:0, behavior:'instant' }])
 assert.deepEqual(page.scrolls, [])
})
