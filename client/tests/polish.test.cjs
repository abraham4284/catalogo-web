const assert=require('node:assert/strict'),test=require('node:test'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');const root=path.resolve(__dirname,'../src'),cache=new Map();function load(name){const file=path.resolve(root,name+'.ts');if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const req=s=>s.startsWith('@/')?load(s.slice(2)):s.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),s))):require(s);new Function('require','module','exports',output)(req,m,m.exports);return m.exports}
test('order FAQ is grouped once with four sections and a single contextual answer', () => {
  const { storefrontContent, getProductFaq } = load('content/storefront-content')
  assert.equal(storefrontContent.faq.length, 7)
  const groups = storefrontContent.faq.filter(item => item.items)
  assert.equal(groups.length, 1)
  assert.equal(groups[0].question, 'Compras por encargo')
  assert.equal(groups[0].items.length, 4)
  const allQuestions = storefrontContent.faq.flatMap(item => [item.question, ...(item.items ?? []).map(child => child.question)])
  assert.equal(new Set(allQuestions).size, allQuestions.length)
  const answers = groups[0].items.map(item => item.answer).join(' ')
  for (const copy of ['30%', '70%', 'aceptación expresa', 'acreditación', 'íntegramente', 'arrepentimiento', 'Garantía:']) assert(answers.includes(copy))
  assert.equal(getProductFaq('on_order').length, 1)
  assert(getProductFaq('on_order')[0].answer.includes('30%'))
  assert(!getProductFaq('on_order')[0].items)
  assert.equal(getProductFaq('in_stock').length, 3)
  assert.deepEqual(getProductFaq('in_stock'), getProductFaq('out_of_stock'))
  assert(!getProductFaq('out_of_stock').some(item => item.answer.includes('30%')))
})
test('order detail uses the approved short notice without calculated amounts', () => {
  const { storefrontContent } = load('content/storefront-content')
  assert.equal(storefrontContent.orderProductNotice, 'Para confirmar tu encargo se solicita un anticipo del 30% del valor total. Antes de abonar, confirmamos precio, disponibilidad y plazo de entrega.')
  const source = fs.readFileSync(path.join(root, 'features/catalog/components/ProductDetail.tsx'), 'utf8')
  assert(source.includes("product.availabilityStatus === 'on_order'"))
  assert(source.includes('storefrontContent.orderProductNotice'))
  for (const obsolete of ['calculateOrderPayment', 'Precio publicado:', 'Anticipo para confirmar:', 'Saldo restante:']) assert(!source.includes(obsolete))
  assert(!fs.existsSync(path.join(root, 'features/catalog/domain/order-payment.ts')))
})
test('hero selects confirmed slug, available-image fallback, no mutation',()=>{const{selectHeroProduct,FEATURED_HERO_PRODUCT_SLUG}=load('features/catalog/utils/merchandising');assert.equal(FEATURED_HERO_PRODUCT_SLUG,'lattafa-oud-for-glory');const fallback={slug:'otro',imageUrl:'/a',availabilityStatus:'in_stock'},target={slug:FEATURED_HERO_PRODUCT_SLUG,imageUrl:'/b',availabilityStatus:'on_order'},items=Object.freeze([fallback,target]);assert.equal(selectHeroProduct(items),target);assert.equal(selectHeroProduct([fallback],{...target,imageUrl:null}),fallback);assert.equal(selectHeroProduct([]),undefined);assert.deepEqual(items,[fallback,target])});
test('related excludes identity/slugs, filters category and deduplicates',()=>{const{selectRelatedProducts:select}=load('features/catalog/utils/merchandising');const current={idProduct:1,slug:'uno',category:{slug:'cat'}},related={...current,idProduct:2,slug:'dos'};assert.deepEqual(select([current,related,related,{...related,idProduct:3},{...related,idProduct:4,slug:'cuatro',category:{slug:'other'}}],current),[related]);assert.deepEqual(select([],current),[])});
test('on_order inquiry asks for terms and links canonical public slug',()=>{const{buildWhatsAppProductInquiryMessage:build,getWhatsAppProductInquiryLabel}=load('features/whatsapp/domain/whatsapp-product-inquiry');const text=build({name:'Producto',slug:'producto',price:100,availabilityStatus:'on_order'});assert(text.includes('30%'));assert(text.includes('https://vitruno.com.ar/productos/producto'));assert(text.includes('Consultar no confirma una compra'));assert.equal(getWhatsAppProductInquiryLabel('on_order'),'Consultar y encargar')});
