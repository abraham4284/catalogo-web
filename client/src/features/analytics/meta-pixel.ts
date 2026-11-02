import { useAnalyticsConsent } from './consent'

type PixelCall = [command: string, ...args: unknown[]]
type Pixel = ((...args: PixelCall) => void) & {
  queue: PixelCall[]; callMethod?: (...args: PixelCall) => void
  push?: Pixel; loaded: boolean; version: string
}
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }

let initialized = false
let stopped = false
let path = ''
let visit = 0
let pageVisit = -1
let viewed = ''
export function validPixelId(value: unknown): value is string {
  return typeof value === 'string' && /^[1-9]\d{5,29}$/.test(value)
}
function call(...args: PixelCall) {
  try { window.fbq?.(...args) } catch { /* Analytics never blocks commerce. */ }
}
export function initMetaPixel() {
  if (stopped || useAnalyticsConsent.getState().consent !== 'accepted') return false
  if (initialized) return true
  const id: unknown = import.meta.env.VITE_META_PIXEL_ID
  if (!validPixelId(id)) return false
  try {
    if (!window.fbq) {
      const pixel: Pixel = Object.assign((...args: PixelCall) => {
        if (pixel.callMethod) pixel.callMethod(...args)
        else if (pixel.queue.length < 100) pixel.queue.push(args)
      }, { queue: [] as PixelCall[], loaded: true, version: '2.0' })
      pixel.push = pixel
      window.fbq = pixel
      window._fbq = pixel
    }
    call('set', 'autoConfig', false, id)
    call('consent', 'grant')
    call('init', id)
    initialized = true
    const script = document.createElement('script')
    script.id = 'vitruno-meta-pixel'
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.onerror = () => { stopped = true; if (window.fbq) window.fbq.queue.length = 0 }
    document.head.append(script)
    return true
  } catch { stopped = true; return false }
}
export function revokeMetaPixel() {
  stopped = true
  call('consent', 'revoke')
  if (window.fbq) window.fbq.queue.length = 0
  document.getElementById('vitruno-meta-pixel')?.remove()
  // A loaded third-party SDK cannot be reliably unloaded in the current document.
  if (initialized) window.location.reload()
}
function track(event: string, payload: Record<string, unknown> = {}) {
  if (initMetaPixel()) call('track', event, payload)
}
export function trackPageView(pathname: string) {
  if (path !== pathname) { path = pathname; visit++; viewed = '' }
  if (pageVisit !== visit && initMetaPixel()) {
    pageVisit = visit
    call('track', 'PageView')
  }
}
export type AnalyticsProduct = { idProduct: number; name: string; price: number }
function productPayload(product: AnalyticsProduct) {
  return { content_ids: [String(product.idProduct)], content_name: product.name,
    content_type: 'product', contents: [{ id: String(product.idProduct), quantity: 1 }], value: product.price, currency: 'ARS' }
}
export function trackViewContent(product: AnalyticsProduct, pathname: string) {
  trackPageView(pathname)
  const key = `${visit}:${product.idProduct}`
  if (viewed !== key && initMetaPixel()) { viewed = key; track('ViewContent', productPayload(product)) }
}
export function trackAddToCart(product: AnalyticsProduct) { track('AddToCart', productPayload(product)) }
export function trackInitiateCheckout(items: readonly { idProduct: number; quantity: number; price: number }[]) {
  track('InitiateCheckout', { content_ids: items.map((item) => String(item.idProduct)),
    contents: items.map((item) => ({ id: String(item.idProduct), quantity: item.quantity })),
    num_items: items.reduce((n, item) => n + item.quantity, 0),
    value: items.reduce((n, item) => n + item.price * item.quantity, 0), currency: 'ARS' })
}
export function trackContact(source: 'contact_page' | 'product_inquiry', product?: { idProduct: number; name: string; availabilityStatus: string }) {
  track('Contact', { source, ...(source === 'product_inquiry' && product ? {
    content_ids: [String(product.idProduct)], content_name: product.name, availability_status: product.availabilityStatus,
  } : {}) })
}
