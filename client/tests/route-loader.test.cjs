const assert = require('node:assert/strict')
const test = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const source = fs.readFileSync(path.resolve(__dirname, '../src/app/recoverable-page-loader.ts'), 'utf8')
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const loaded = { exports: {} }
new Function('exports', output)(loaded.exports)
const { createRecoverablePageLoader } = loaded.exports

test('healthy page loading never requests recovery', async () => {
  const page = { Component: 'fixture' }
  let retries = 0
  const load = createRecoverablePageLoader(async () => page, async () => { retries++; return page })
  assert.equal(await load(), page)
  assert.equal(await load(), page)
  assert.equal(retries, 0)
})

test('failed prefetch allows navigation to use an independent module URL', async () => {
  const error = new Error('failed module fetch')
  let primaryCalls = 0
  const page = { Component: 'recovered' }
  const load = createRecoverablePageLoader(async () => { primaryCalls++; throw error }, async () => page)
  await assert.rejects(load(), error)
  assert.equal(await load(), page)
  assert.equal(await load(), page)
  assert.equal(primaryCalls, 1)
})

test('persistent recovery failure is propagated to the router', async () => {
  const error = new Error('offline')
  const load = createRecoverablePageLoader(async () => { throw error }, async () => { throw error })
  await assert.rejects(load(), error)
  await assert.rejects(load(), error)
})
