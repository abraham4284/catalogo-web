const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const axios = require('axios')

// Transpile the real boundary modules in memory; no server or extra test dependency.
function loadCatalog() {
  const cache = new Map()
  const runtimeEnv = {}
  const src = path.resolve(__dirname, '../src')
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env', 'runtimeEnv')
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText
    const localRequire = (specifier) => {
      if (specifier.startsWith('@/')) return load(path.join(src, `${specifier.slice(2)}.ts`))
      if (specifier.startsWith('.')) return load(path.resolve(path.dirname(filename), `${specifier}.ts`))
      return require(specifier)
    }
    new Function('require', 'module', 'exports', 'runtimeEnv', output)(localRequire, module, module.exports, runtimeEnv)
    return module.exports
  }
  return { load, src, runtimeEnv }
}

const category = { idProductCategory: 1, name: 'Categoría de prueba' }
const product = {
  idProduct: 2, name: 'Producto de prueba', description: null, price: 10,
  imageUrl: null, category, available: false,
}
const pagination = { page: 1, currentPage: 1, limit: 24, total: 1, totalRecords: 1, totalPages: 1 }

test('catalog URL filters normalize invalid values and preserve navigation', () => {
  const { load, src } = loadCatalog()
  const { readCatalogFilters, getCatalogHref } = load(path.join(src, 'features/catalog/utils/catalog-url.ts'))
  for (const value of ['-1', '0', '1.5', 'NaN', 'Infinity', '1e3', '9007199254740992']) {
    const filters = readCatalogFilters(new URLSearchParams({ page: value, category: value }))
    assert.equal(filters.page, 1)
    assert.equal(filters.category, undefined)
  }
  const filters = readCatalogFilters(new URLSearchParams('search=++auricular++&category=3&page=2'))
  assert.deepEqual(filters, { page: 2, category: 3, search: 'auricular' })
  assert.equal(getCatalogHref({ ...filters, page: 1 }), '/productos?search=auricular&category=3')
  assert.equal(getCatalogHref({ ...filters, category: undefined, page: 1 }), '/productos?search=auricular')
  assert.equal(getCatalogHref({ ...filters, search: '', page: 1 }), '/productos?category=3')
  assert.equal(getCatalogHref({ page: 1 }), '/productos')
  assert.equal(readCatalogFilters(new URLSearchParams({ search: 'x'.repeat(200) })).search.length, 150)
})

test('catalog presentation errors hide technical messages and omit cancellations', () => {
  const { load, src } = loadCatalog()
  const { CatalogError } = load(path.join(src, 'features/catalog/api/catalog.error.ts'))
  const { getCatalogPresentationError } = load(path.join(src, 'features/catalog/utils/catalog-presentation-error.ts'))
  for (const code of ['NETWORK', 'HTTP', 'INVALID_RESPONSE', 'INVALID_INPUT']) {
    const message = getCatalogPresentationError(new CatalogError(code, 'private details', { statusCode: 404 }))
    assert.equal(message.includes('private'), false)
  }
  assert.equal(getCatalogPresentationError(new CatalogError('NETWORK', 'private', { isCancelled: true })), undefined)
})

test('catalog boundary: contracts, inputs, transport and lazy configuration', async (t) => {
  const { load, src, runtimeEnv } = loadCatalog()
  const api = load(path.join(src, 'features/catalog/api/catalog.api.ts'))
  const { CatalogError } = load(path.join(src, 'features/catalog/api/catalog.error.ts'))
  await t.test('import is lazy; missing configuration is normalized', async () => {
    await assert.rejects(api.getCatalogBusiness(), (error) => error instanceof CatalogError && error.code === 'INVALID_INPUT')
  })

  // Reserved .invalid host; all requests use the adapter below, never the network.
  runtimeEnv.VITE_CATALOG_API_URL = 'https://catalog.invalid/api/public/'
  const http = load(path.join(src, 'shared/api/catalog-http.ts')).getCatalogHttp()
  let calls = 0
  let payload
  let failure
  let lastConfig
  http.defaults.adapter = async (config) => {
    calls++
    lastConfig = config
    if (failure) throw failure(config)
    return { data: payload, status: 200, statusText: 'OK', headers: {}, config }
  }
  const success = (data) => { payload = { status: true, message: 'OK', data }; failure = undefined }
  const rejectsWith = (code, extra = () => true) => (error) => error instanceof CatalogError && error.code === code && extra(error)

  await t.test('all four endpoints return validated data and retain pagination aliases', async () => {
    const business = { name: 'Negocio', slug: 'negocio', logoUrl: null, businessType: null }
    success({ ...business, idBusiness: 99 })
    assert.deepEqual(await api.getCatalogBusiness(), business)
    assert.equal(lastConfig.url, '/catalog')
    assert.equal(http.getUri(lastConfig), 'https://catalog.invalid/api/public/catalog')
    assert.equal(lastConfig.withCredentials, false)
    assert.equal(lastConfig.headers.has('Authorization'), false)
    success([category])
    assert.deepEqual(await api.getCatalogCategories(), [category])
    assert.equal(lastConfig.url, '/catalog/categories')
    success({ items: [product], pagination })
    assert.deepEqual(await api.getCatalogProducts({ search: '  prueba  ', page: 1, limit: 60 }), { items: [product], pagination })
    assert.deepEqual(lastConfig.params, { page: 1, limit: 60, search: 'prueba' })
    await api.getCatalogProducts({ search: '   ', idProductCategory: undefined })
    assert.deepEqual(lastConfig.params, {})
    const detail = { ...product, gallery: [{ imageUrl: '/relative.png', altText: null, sortOrder: 0 }] }
    success(detail)
    assert.deepEqual(await api.getCatalogProductById(2), detail)
    assert.equal(lastConfig.url, '/catalog/products/2')
  })

  await t.test('invalid input never makes a request', async () => {
    const before = calls
    for (const query of [{ page: 0 }, { page: 1.5 }, { limit: 61 }, { limit: 0 }, { search: 'x'.repeat(151) }, { idProductCategory: -1 }]) {
      await assert.rejects(api.getCatalogProducts(query), rejectsWith('INVALID_INPUT', (error) => error.fieldErrors.length > 0))
    }
    for (const id of [0, -1, 1.5, '2']) await assert.rejects(api.getCatalogProductById(id), rejectsWith('INVALID_INPUT'))
    assert.equal(calls, before)
  })

  await t.test('invalid external contracts are INVALID_RESPONSE', async () => {
    for (const data of [null, '<html>error</html>', { status: true, message: 'OK', data: { ...product, price: '10' } }]) {
      payload = data
      await assert.rejects(api.getCatalogProductById(2), rejectsWith('INVALID_RESPONSE'))
    }
    success({ ...product, gallery: [{ imageUrl: '/image.png', altText: null, sortOrder: 0.5 }] })
    await assert.rejects(api.getCatalogProductById(2), rejectsWith('INVALID_RESPONSE'))
    success({ ...product, gallery: [{ imageUrl: '/image.png', altText: null, sortOrder: -1 }] })
    await assert.rejects(api.getCatalogProductById(2), rejectsWith('INVALID_RESPONSE'))
    success({ items: [], pagination: { ...pagination, total: 0, totalRecords: 0, totalPages: 0 } })
    await assert.rejects(api.getCatalogProducts(), rejectsWith('INVALID_RESPONSE'))
    success({ items: [], pagination: { ...pagination, total: 0, totalRecords: 0, totalPages: 1 } })
    assert.equal((await api.getCatalogProducts()).pagination.totalPages, 1)
  })

  await t.test('backend errors preserve status and fields; malformed bodies stay safe', async () => {
    const body = { status: false, message: 'Error de validacion', errors: [{ field: 'page', message: 'Inválido' }] }
    failure = (config) => new axios.AxiosError('HTTP failure', 'ERR_BAD_REQUEST', config, undefined, {
      status: 400, data: body, config, headers: {}, statusText: 'Bad Request',
    })
    await assert.rejects(api.getCatalogProducts(), rejectsWith('HTTP', (error) => error.statusCode === 400 && error.fieldErrors[0].field === 'page'))
    body.errors = undefined
    body.message = 'Catalogo publico no disponible'
    await assert.rejects(api.getCatalogBusiness(), rejectsWith('HTTP'))
    failure = (config) => new axios.AxiosError('Private detail', 'ERR_BAD_RESPONSE', config, undefined, {
      status: 500, data: '<html>private</html>', config, headers: {}, statusText: 'Failure',
    })
    await assert.rejects(api.getCatalogBusiness(), rejectsWith('INVALID_RESPONSE', (error) => error.statusCode === 500 && !error.message.includes('private')))
    failure = undefined
    payload = { status: false, message: 'Error interno' }
    await assert.rejects(api.getCatalogBusiness(), rejectsWith('HTTP'))
  })

  await t.test('network, timeout and cancellation are distinguishable', async () => {
    for (const code of ['ERR_NETWORK', 'ECONNABORTED']) {
      failure = (config) => new axios.AxiosError('Private detail', code, config)
      await assert.rejects(api.getCatalogBusiness(), rejectsWith('NETWORK', (error) => !error.isCancelled))
    }
    failure = (config) => new axios.CanceledError('Canceled', config)
    await assert.rejects(api.getCatalogBusiness(), rejectsWith('NETWORK', (error) => error.isCancelled))
    failure = undefined
    const controller = new AbortController()
    controller.abort()
    await assert.rejects(api.getCatalogCategories(controller.signal), rejectsWith('NETWORK', (error) => error.isCancelled))
  })
})
