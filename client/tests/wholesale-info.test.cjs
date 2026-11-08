const assert=require('node:assert/strict'),test=require('node:test'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript')
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{MemoryRouter}=require('react-router-dom')
const root=path.resolve(__dirname,'../src'),cache=new Map(),policy={wholesaleEnabled:true,wholesaleMinimumAmount:12345}
const noop=()=>null
function load(name){
 const base=path.resolve(root,name)
 if(base.endsWith(path.join('store','business.store')))return{useCatalogPricing:()=>policy}
 if(base===path.join(root,'features','catalog'))return{
  WholesaleNotice:load('features/catalog/components/ProductPrices').WholesaleNotice,
  useCatalogHome:()=>({status:'success',data:{categories:[],products:{items:[]},heroLoading:false}}),
  useCatalogListing:()=>({categories:{status:'success',data:[]},products:{status:'success',data:{items:[],pagination:{totalPages:1,currentPage:1,totalRecords:0}}}}),
  ...load('features/catalog/utils/catalog-url'),
  CatalogSearch:noop,CategoryFilter:noop,CatalogErrorState:noop,CatalogLoadingState:noop,CatalogEmptyState:noop,ProductGrid:noop,CatalogPaginationControls:noop,
 }
 for(const component of ['HomeHero','HomeEditorial','HomeBuyingGuide'])if(base.endsWith(path.join('pages','home','components',component)))return{[component]:noop}
 if(base.endsWith(path.join('app','compositions','ProductCommerceActions')))return{ProductCommerceActions:noop}
 const file=['.ts','.tsx'].map(ext=>base+ext).find(file=>fs.existsSync(file))
 if(cache.has(file))return cache.get(file).exports
 const module={exports:{}};cache.set(file,module)
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const req=name=>name.startsWith('@/')?load(name.slice(2)):name.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),name))):require(name)
 new Function('require','module','exports',output)(req,module,module.exports);return module.exports
}
const render=(component,props)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(component,props)))
const {ProductDetail}=load('features/catalog/components/ProductDetail')
const {storefrontContent,getProductFaq}=load('content/storefront-content')
const {formatCurrency}=load('shared/utils/format-currency')
const product={idProduct:1,slug:'producto',name:'Producto',description:'Descripción completa.',price:999,priceSale:22000,priceWholesale:19000,imageUrl:null,gallery:[],richContent:null,category:{slug:'categoria',name:'Categoría',idProductCategory:1},availabilityStatus:'in_stock',saleMode:'stock',availabilityNote:null,stockAvailable:10}

test('detail keeps prices, status and actions without a global notice or redundant retail-only paragraph',()=>{
 for(const priceWholesale of[19000,null]){
  const html=render(ProductDetail,{product:{...product,priceWholesale},actions:React.createElement('button',null,'Agregar al carrito')})
  assert(html.includes(formatCurrency(22000)))
  assert(html.includes('Disponible'))
  assert(html.includes('Agregar al carrito'))
  assert(html.includes('Descripción completa.'))
  assert(!html.includes('Mayorista desde'))
  assert(!html.includes('Precio mayorista desde'))
  assert(!html.includes('Podés combinar productos de distintas categorías'))
  assert(!html.includes('Este producto se vende solo a precio minorista'))
  if(priceWholesale===null)assert.equal((html.match(/Solo minorista/g)||[]).length,1)
  else assert(html.includes(formatCurrency(19000)))
 }
})
test('order policy and short contextual FAQ are preserved without wholesale FAQ duplication',()=>{
 const html=render(ProductDetail,{product:{...product,availabilityStatus:'on_order',saleMode:'on_order'}})
 assert(html.includes(storefrontContent.orderProductNotice))
 assert.equal(getProductFaq('on_order').length,1)
 assert.equal(getProductFaq('in_stock').length,3)
 assert(!getProductFaq('on_order').some(item=>item.question.includes('mayorista')))
})
test('global notice is rendered by CatalogPage and removed from HomePage',()=>{
 const catalog=render(load('pages/catalog/CatalogPage').CatalogPage)
 const home=render(load('pages/home/HomePage').HomePage)
 assert(catalog.includes(`Mayorista desde ${formatCurrency(policy.wholesaleMinimumAmount)} en valor mayorista`))
 assert(catalog.includes('href="/preguntas-frecuentes"'))
 assert(catalog.includes('¿Cómo funciona?'))
 assert(!home.includes('Mayorista desde'))
})
test('FAQ contains the six wholesale questions beside the intact order group using native closed details',()=>{
 const wholesale=storefrontContent.faq.find(item=>item.question==='Compras minoristas y mayoristas')
 const order=storefrontContent.faq.find(item=>item.question==='Compras por encargo')
 assert(wholesale&&order)
 assert.deepEqual(wholesale.items.map(item=>item.question),[
 '¿Cuál es la diferencia entre precio minorista y mayorista?',
 '¿Cómo accedo al precio mayorista?',
 '¿Cómo se calcula el mínimo mayorista?',
 '¿Qué pasa si no llego al mínimo?',
 '¿Qué significa “Solo minorista”?',
 '¿Ya soy cliente mayorista?',
 ])
 assert.equal(order.items.length,4)
 assert(order.items.some(item=>item.answer.includes('30%')&&item.answer.includes('70%')))
 const html=render(load('pages/faq/FaqPage').FaqPage)
 assert.equal((html.match(/<details /g)||[]).length,18)
 assert(!html.includes(' open='))
 assert(html.includes('Encontrá información sobre compras minoristas y mayoristas'))
})
test('wholesale FAQ explains conditions in commercial language without a hardcoded minimum',()=>{
 const group=storefrontContent.faq.find(item=>item.question==='Compras minoristas y mayoristas')
 const copy=group.items.map(item=>item.answer).join(' ')
 for(const text of['todos los productos','precios mayoristas','distintas categorías','Podés comprar igualmente','no se activa automáticamente','WhatsApp'])assert(copy.includes(text))
 assert(!/\d|\$|wholesaleCandidate|pricingType|effectiveSubtotal|priceWholesale/.test(JSON.stringify(group)))
})
