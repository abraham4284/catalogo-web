const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript')
const contentFile=path.resolve(__dirname,'../src/content/storefront-content.ts')
const contentModule={exports:{}}
new Function('require','module','exports',ts.transpileModule(fs.readFileSync(contentFile,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(require,contentModule,contentModule.exports)
const content=contentModule.exports,hash='#'+content.WHOLESALE_FAQ_ID
function harness(initialHash='',options={}){
 const refs=[],effects=[],cleanups=[],frames=new Map(),scrolls=[]
 let location={hash:initialHash,key:'initial'},refIndex=0,effectIndex=0,pending=[],frameId=0,focusCalls=0,lookups=0
 class Details{constructor(){this.open=false}scrollIntoView(options){scrolls.push(options)}focus(){focusCalls++}}
 const target=new Details(),children=Array.from({length:6},()=>new Details()),order=new Details()
 const container={contains:element=>options.outside!==true&&element===target}
 const hooks={useRef:value=>{const index=refIndex++;return refs[index]??(refs[index]={current:value})},useEffect:(callback,deps)=>{const index=effectIndex++,previous=effects[index];if(!previous||deps.some((value,i)=>!Object.is(value,previous[i])))pending.push(()=>{cleanups[index]?.();cleanups[index]=callback()});effects[index]=deps}}
 const module={exports:{}},file=path.resolve(__dirname,'../src/pages/faq/FaqPage.tsx')
 const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const noop=()=>null
 const req=name=>name==='react'?hooks:name==='react-router-dom'?{Link:noop,useLocation:()=>location}:name==='@/content/storefront-content'?content:name==='@/app/compositions/StorefrontFaq'?{StorefrontFaq:noop}:name==='@/features/whatsapp/utils/whatsapp-general-inquiry'?{getWhatsAppGeneralInquiryHref:noop}:require(name)
 new Function('require','module','exports','document','HTMLDetailsElement','requestAnimationFrame','cancelAnimationFrame',source)(req,module,module.exports,{getElementById:id=>{lookups++;return options.missing?null:id===content.WHOLESALE_FAQ_ID?target:null}},Details,callback=>{frames.set(++frameId,callback);return frameId},id=>frames.delete(id))
 const flush=()=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(callback=>callback())}
 function render(nextHash=location.hash,key=location.key,runFrame=true){location={hash:nextHash,key};refIndex=0;effectIndex=0;pending=[];const tree=module.exports.FaqPage();tree.props.ref.current=container;pending.forEach(callback=>callback());if(runFrame)flush()}
 return{render,flush,target,children,order,scrolls,lookups:()=>lookups,focusCalls:()=>focusCalls}
}
test('explicit stable ID is attached only to the intended top-level FAQ entry',()=>{
 const entries=content.storefrontContent.faq.filter(entry=>entry.id)
 assert.equal(content.WHOLESALE_FAQ_ID,'compras-minoristas-y-mayoristas')
 assert.deepEqual(entries.map(entry=>entry.question),['Compras minoristas y mayoristas'])
 assert.equal(entries[0].items.length,6)
})
test('direct hash entry opens only the parent and scrolls immediately without focus',()=>{
 const page=harness(hash);page.render()
 assert.equal(page.target.open,true)
 assert(page.children.every(child=>child.open===false))
 assert.equal(page.order.open,false)
 assert.deepEqual(page.scrolls,[{behavior:'auto',block:'start'}])
 assert.equal(page.focusCalls(),0)
})
test('normal and unknown hashes do not open or scroll arbitrary elements',()=>{
 for(const value of['','#inexistente','#compras-por-encargo','#%zz']){const page=harness(value);page.render();assert.equal(page.target.open,false);assert.equal(page.lookups(),0);assert.deepEqual(page.scrolls,[])}
})
test('hash navigation reopens its parent while ordinary rerenders preserve native manual closing',()=>{
 const page=harness();page.render();page.render(hash,'link')
 assert.equal(page.target.open,true)
 page.target.open=false;page.render(hash,'link')
 assert.equal(page.target.open,false)
 assert.equal(page.scrolls.length,1)
 page.render(hash,'forward')
 assert.equal(page.target.open,true)
 assert.equal(page.scrolls.length,2)
})
test('missing/outside targets and cancelled hash changes are safe',()=>{
 for(const options of[{missing:true},{outside:true}]){const page=harness(hash,options);page.render();assert.equal(page.target.open,false);assert.deepEqual(page.scrolls,[])}
 const page=harness();page.render();page.render(hash,'link',false);page.render('#inexistente','other',false);page.flush()
 assert.equal(page.target.open,false)
 assert.deepEqual(page.scrolls,[])
})
