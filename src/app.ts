import { createPinia } from 'pinia'
import { createApp } from 'vue'
import '@/assets/less/index.less'
import Taro from '@tarojs/taro'

// Polyfill getRootNode on Taro simulated DOM prototypes to avoid Vue 3.5+ directive crashes
function polyfillGetRootNode() {
  if (typeof document !== 'undefined') {
    try {
      const el = document.createElement('div')
      if (el) {
        let proto = Object.getPrototypeOf(el)
        while (proto && proto !== Object.prototype) {
          if (!proto.getRootNode) {
            proto.getRootNode = function() {
              let node = this
              while (node.parentNode) {
                node = node.parentNode
              }
              return node
            }
          }
          proto = Object.getPrototypeOf(proto)
        }
      }
    } catch (e) {
      console.error('Failed to inject getRootNode polyfill:', e)
    }
  }
}

// Run immediately
polyfillGetRootNode()

// Monkey-patch Taro.navigateTo globally to track page stack growth and capture silent navigateTo rejections
const originalNavigateTo = Taro.navigateTo
Taro.navigateTo = function(options: any) {
  try {
    const pages = Taro.getCurrentPages()
    console.log(
      '[Taro.navigateTo] pages length:',
      pages.length,
      'routes:',
      pages.map(p => p.route || p.$taroPath || '')
    )
  } catch (e) {
    console.error('[Taro.navigateTo] failed to inspect page stack:', e)
  }

  const originalFail = options.fail
  options.fail = function(err: any) {
    console.error('[Taro.navigateTo] navigateTo FAILED! target URL:', options.url, 'error details:', err)
    if (originalFail) {
      try {
        originalFail(err)
      } catch (e) {
        console.error('[Taro.navigateTo] custom fail handler threw:', e)
      }
    }
  }

  return originalNavigateTo.call(Taro, options)
}

export const pinia = createPinia()

export function initPinia() {
  pinia.use(({ store, options }: any) => {
    const persist = options.persist
    if (!persist) {
      return
    }

    const key = typeof persist.key === 'string' ? persist.key : store.$id
    const pick = Array.isArray(persist.pick) ? persist.pick : []
    const saved = Taro.getStorageSync(key)

    if (saved) {
      try {
        const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved
        store.$patch(parsed)
      } catch (error) {
        console.error('Pinia persist hydrate failed:', error)
      }
    }

    store.$subscribe((_mutation: unknown, state: Record<string, unknown>) => {
      const data: Record<string, unknown> = {}

      if (pick.length > 0) {
        pick.forEach((field: string) => {
          data[field] = state[field]
        })
      } else {
        Object.keys(state).forEach((field) => {
          data[field] = state[field]
        })
      }

      Taro.setStorageSync(key, JSON.stringify(data))
    }, { detached: true })
  })
  return pinia
}

initPinia()

const app = createApp({
  onShow(options: any) {
    console.log('App onShow', options)
  },
  onHide() {
    // console.log('App onHide')
  },
  onLaunch() {
    // 应用启用时触发，只会触发一次
    polyfillGetRootNode()
  }
})

// Global error handlers for easier visual debugging
const pendingErrors: string[] = []
let errorTimeout: any = null

function reportErrors() {
  if (pendingErrors.length === 0) return
  const msg = pendingErrors.join('\n\n')
  Taro.showModal({
    title: '运行时错误捕获',
    content: msg.substring(0, 400),
    showCancel: false,
    confirmText: '关闭'
  }).catch(err => {
    console.error('Failed to show error modal:', err)
  })
}

function queueError(source: string, err: any) {
  const errStr = typeof err === 'object' ? (err.message || err.stack || JSON.stringify(err)) : String(err)
  const fullMsg = `[${source}] ${errStr}`
  console.error(fullMsg, err)
  pendingErrors.push(fullMsg)

  try {
    Taro.setStorageSync('__app_boot_error__', pendingErrors.join('\n\n'))
  } catch (e) {
    console.error('Failed to write to storage:', e)
  }

  if (errorTimeout) clearTimeout(errorTimeout)
  errorTimeout = setTimeout(reportErrors, 3000)
}

app.config.errorHandler = (err: any, _instance: any, info: any) => {
  queueError('Vue Error', `${err} (info: ${info})`)
}

Taro.onError((error) => {
  queueError('Taro Global Error', error)
})

app.use(pinia)

export default app

