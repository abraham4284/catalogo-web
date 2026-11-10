const assert=require('node:assert/strict'),test=require('node:test'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript')
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{MemoryRouter}=require('react-router-dom')
const root=path.resolve(__dirname,'../src'),cache=new Map(),policy={wholesaleEnabled:true,wholesaleMinimumAmount:12345}
const noop=()=>null
let whatsappNumber = '5491123456789'
const shareBrowser = {}
const notifications = []
function load(name){
 const base=path.resolve(root,name)
 if(name==='config/env')return{getWhatsAppNumber:()=>whatsappNumber}
 if(name==='features/analytics')return{trackContact:noop}
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
 const req = name => {
  if (name.startsWith('@phosphor-icons/react/dist/csr/')) return { [name.split('/').at(-1) + 'Icon']: noop }
  if (name === 'react-hot-toast') return {
   __esModule: true,
   default: {
    success: message => notifications.push(['success', message]),
    error: message => notifications.push(['error', message]),
   },
  }
  if (name.startsWith('@/')) return load(name.slice(2))
  if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(file), name)))
  return require(name)
 }
 new Function('require','module','exports','navigator',output)(req,module,module.exports,shareBrowser);return module.exports
}
const render=(component,props)=>renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(component,props)))
const {ProductDetail}=load('features/catalog/components/ProductDetail')
const {storefrontContent,getProductFaq}=load('content/storefront-content')
const {formatCurrency}=load('shared/utils/format-currency')
const product={idProduct:1,slug:'producto',name:'Producto',description:'Descripción completa.',price:999,priceSale:22000,priceWholesale:19000,imageUrl:null,gallery:[],richContent:null,category:{slug:'categoria',name:'Categoría',idProductCategory:1},availabilityStatus:'in_stock',saleMode:'stock',availabilityNote:null,stockAvailable:10}

test('catalog search explains product/category search with a visible label and keeps form constraints',()=>{
 const {CatalogSearch}=load('features/catalog/components/CatalogSearch')
 const html=render(CatalogSearch,{search:'auriculares',onSearch:()=>{}})
 assert(html.includes('<label for="catalog-search"'))
 assert(html.includes('>Buscar productos o categorías</label>'))
 assert(html.includes('placeholder="Ej. auriculares, perfumes, cargadores..."'))
 assert(html.includes('role="search"'))
 assert(html.includes('id="catalog-search"'))
 assert(html.includes('type="search"'))
 assert(html.includes('maxLength="150"'))
 assert(html.includes('value="auriculares"'))
 assert(html.includes('>Buscar</button>'))
 assert(html.includes('>Limpiar búsqueda</button>'))
})

test('catalog search submits explicitly, trims the term and clears through the existing callback',()=>{
 const {CatalogSearch}=load('features/catalog/components/CatalogSearch')
 const values=[],tree=CatalogSearch({search:'anterior',onSearch:value=>values.push(value)})
 const nativeFormData=global.FormData
 let prevented=0
 try{
  // Node has no HTMLFormElement: keep the real submit handler and supply its form boundary.
  global.FormData=class{constructor(form){return form}}
  assert.deepEqual(values,[])
  for(const value of ['auriculares','  bluetooth  ','   ']){
   tree.props.onSubmit({preventDefault:()=>prevented++,currentTarget:new Map([['search',value]])})
  }
 }finally{global.FormData=nativeFormData}
 assert.equal(prevented,3)
 assert.deepEqual(values,['auriculares','bluetooth',''])
 tree.props.children[1].props.children[2].props.onClick()
 assert.deepEqual(values,['auriculares','bluetooth','',''])
})

test('cards show out_of_stock once over the image and keep other states below prices',()=>{
 const {ProductCard}=load('features/catalog/components/ProductCard')
 for(const [availabilityStatus,label,stockAvailable] of [['out_of_stock','AGOTADO',20],['in_stock','Disponible',10],['on_order','Por encargo',0]]){
  const html=render(ProductCard,{product:{...product,availabilityStatus,stockAvailable}})
  const imageEnd=html.indexOf('</div>'),price=html.indexOf(formatCurrency(19000))
  assert.equal((html.match(new RegExp(`>${label}<`,'g'))||[]).length,1)
  if(availabilityStatus==='out_of_stock'){
   assert(html.indexOf('>AGOTADO<')<imageEnd)
   assert(!html.includes('>Agotado<'))
   assert(!html.includes('aria-hidden="true"'))
  }else{
   assert(!html.includes('AGOTADO'))
   assert(html.indexOf(`>${label}<`)>price)
  }
  assert(html.includes('href="/productos/producto"'))
  assert(html.includes('aria-label="Ver Producto"'))
 }
})

test('out_of_stock image badge survives missing imagery without hiding the fallback',()=>{
 const {ProductCardImage}=load('features/catalog/components/ProductCardImage')
 for(const imageUrl of [null,'https://example.test/product.png']){
  const html=render(ProductCardImage,{imageUrl,secondaryImageUrl:'https://example.test/secondary.png',name:'Producto',availabilityStatus:'out_of_stock',stockAvailable:0})
  assert.equal((html.match(/>AGOTADO</g)||[]).length,1)
  assert(!html.includes('aria-hidden="true"'))
  if(imageUrl)assert(html.includes('alt="Producto"'))
  else assert(html.includes('Sin imagen'))
 }
})

test('out_of_stock detail keeps its ordinary textual availability badge',()=>{
 const html=render(ProductDetail,{product:{...product,availabilityStatus:'out_of_stock'}})
 assert.equal((html.match(/>Agotado</g)||[]).length,1)
 assert(!html.includes('AGOTADO'))
})

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
 const copy = '¿Querés acceder a precios mayoristas? Consultanos las condiciones vigentes según categoría.'
 const message = '¡Hola! Quisiera consultar las condiciones y los mínimos vigentes para acceder como cliente mayorista de VITRUNO. ¿Me pueden ayudar?'
 assert(catalog.includes(copy))
 assert(catalog.includes(`href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer"`))
 assert(catalog.includes('Consultar condiciones →'))
 assert(!catalog.includes(formatCurrency(policy.wholesaleMinimumAmount)))
 assert(!home.includes(copy))
})
test('FAQ contains the six wholesale questions beside the intact order group using native closed details',()=>{
 const wholesale=storefrontContent.faq.find(item=>item.question==='Compras minoristas y mayoristas')
 const order=storefrontContent.faq.find(item=>item.question==='Compras por encargo')
 assert(wholesale&&order)
 assert.deepEqual(wholesale.items.map(item=>item.question),[
 '¿Cuál es la diferencia entre precio minorista y mayorista?',
 '¿Hay un monto mínimo de compra para acceder a precios mayoristas?',
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
 for(const text of['precios mayoristas','pueden variar según la categoría','Podés comprar igualmente','no se activa automáticamente','WhatsApp'])assert(copy.includes(text))
 assert(!/\d|\$|wholesaleCandidate|pricingType|effectiveSubtotal|priceWholesale/.test(JSON.stringify(group)))
})

test('native share uses the public product URL and preserves silent cancellation', async () => {
 const { shareProduct } = load('features/catalog/utils/share-product')
 const payloads = []
 const clipboard = { writeText: () => assert.fail('Native share must not copy') }
 assert.equal(await shareProduct(product, { share: async payload => payloads.push(payload), clipboard }), 'shared')
 assert.deepEqual(payloads, [{
  title: 'Producto',
  text: 'Mirá Producto en VITRUNO',
  url: 'https://vitruno.com.ar/productos/producto',
 }])
 const share = async () => { throw new DOMException('Cancelled', 'AbortError') }
 assert.equal(await shareProduct(product, { share, clipboard }), 'cancelled')
})

test('share button copies on missing support or failure and reports clipboard failure accessibly', async () => {
 const { ProductShareButton } = load('features/catalog/components/ProductShareButton')
 const button = ProductShareButton(product)
 assert.equal(button.props['aria-label'], 'Compartir producto')
 const copied = []
 shareBrowser.clipboard = { writeText: async url => copied.push(url) }
 try {
  await button.props.onClick()
  shareBrowser.share = async () => { throw new Error('Share denied') }
  await button.props.onClick()
  shareBrowser.share = async () => { throw new DOMException('Cancelled', 'AbortError') }
  await button.props.onClick()
  assert.deepEqual(copied, Array(2).fill('https://vitruno.com.ar/productos/producto'))
  assert.deepEqual(notifications, Array(2).fill(['success', 'Enlace copiado']))
  delete shareBrowser.share
  shareBrowser.clipboard = { writeText: async () => { throw new Error('Clipboard denied') } }
  await button.props.onClick()
  assert.equal(notifications.at(-1)[0], 'error')
 } finally {
  delete shareBrowser.share
  delete shareBrowser.clipboard
  notifications.length = 0
 }
})

test('last unit appears over the card image and by detail availability only for in_stock with exactly one', () => {
 const { ProductCard } = load('features/catalog/components/ProductCard')
 for (const availabilityStatus of ['in_stock', 'out_of_stock', 'on_order']) {
  for (const stockAvailable of [0, 1, 2]) {
   const item = { ...product, availabilityStatus, stockAvailable }
   const card = render(ProductCard, { product: item })
   const detail = render(ProductDetail, { product: item })
   const lastUnit = availabilityStatus === 'in_stock' && stockAvailable === 1
   assert.equal(card.includes('ÚLTIMA UNIDAD'), lastUnit)
   assert.equal(detail.includes('ÚLTIMA UNIDAD'), lastUnit)
   if (lastUnit) assert(card.indexOf('ÚLTIMA UNIDAD') < card.indexOf('</div>'))
   assert.equal(card.includes('>AGOTADO<'), availabilityStatus === 'out_of_stock')
   assert.equal(card.includes('>Por encargo<'), availabilityStatus === 'on_order')
  }
 }
})

test('FAQ renders the wholesale message and help links while Contact remains available without WhatsApp config', () => {
 const { FaqPage } = load('pages/faq/FaqPage')
 const faq = render(FaqPage)
 const message = '¡Hola! Quisiera consultar las condiciones y los mínimos vigentes para acceder como cliente mayorista de VITRUNO. ¿Me pueden ayudar?'
 assert(faq.includes('¿No encontraste lo que buscabas?'))
 assert(faq.includes('href="/contacto"'))
 assert(faq.includes('>WhatsApp</a>'))
 assert(faq.includes('Consultar condiciones mayoristas por WhatsApp →'))
 assert(faq.includes(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`))
 const saved = whatsappNumber
 try {
  whatsappNumber = undefined
  const withoutWhatsApp = render(FaqPage)
  assert(withoutWhatsApp.includes('href="/contacto"'))
  assert(!withoutWhatsApp.includes('https://wa.me/'))
 } finally {
  whatsappNumber = saved
 }
})

test('Contact retains the form and exposes official social links and configured WhatsApp', () => {
 const { ContactPage } = load('pages/contact/ContactPage')
 const html = render(ContactPage)
 assert(html.includes('Atención online'))
 assert(html.includes('id="contact-name"'))
 assert(html.includes('id="contact-email"'))
 assert(html.includes('id="contact-message"'))
 assert(html.includes('Continuar por WhatsApp'))
 for (const href of [
  'https://www.instagram.com/vitruno.ar/',
  'https://www.facebook.com/people/Vitruno/61595884155088/',
 ]) assert(html.includes(`href="${href}" target="_blank" rel="noopener noreferrer"`))
 assert(html.includes('Consultar por WhatsApp'))
 assert(!/TikTok|<address|<iframe/.test(html))
 const saved = whatsappNumber
 try {
  whatsappNumber = undefined
  const unconfigured = render(ContactPage)
  assert(!unconfigured.includes('Consultar por WhatsApp'))
  assert(unconfigured.includes('Continuar por WhatsApp'))
 } finally {
  whatsappNumber = saved
 }
})
