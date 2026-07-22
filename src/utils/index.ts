import Taro from '@tarojs/taro'

/**
 * Safely gets the menu button bounding client rect across platforms.
 * On H5/Web environment, returns mock coordinates to avoid unsupported API rejections.
 */
export function getSafeMenuButtonBoundingClientRect() {
  const fallback = {
    top: 44,
    bottom: 76,
    height: 32,
    left: 0,
    right: 0,
    width: 0
  }

  // Safe build-time check for H5 / Web environment
  if (process.env.TARO_ENV === 'h5' || process.env.TARO_ENV === 'H5') {
    return fallback
  }

  try {
    if (Taro && typeof Taro.getMenuButtonBoundingClientRect === 'function') {
      const rect = Taro.getMenuButtonBoundingClientRect()
      if (rect && typeof rect.bottom === 'number' && rect.bottom > 0) {
        return rect
      }
    }
  } catch (e) {
    console.warn('Taro.getMenuButtonBoundingClientRect failed, using fallback:', e)
  }

  return fallback
}

/**
 * Utility to get route URL. Simply returns the passed URL string as-is.
 */
export function getRouteUrl(url: string): string {
  return url
}

/**
 * Masks a patient name according to the desensitization rules.
 * - 2 characters: first character masked (e.g. "张三" -> "*三")
 * - > 2 characters: first and last characters kept, middle masked (e.g. "孔晓雯" -> "孔*雯")
 */
export function maskName(name?: string): string {
  if (!name || name === '上午好') return name || ''
  const len = name.length
  if (len <= 1) return name
  if (len === 2) {
    return '*' + name.slice(1)
  }
  return name.slice(0, 1) + '*'.repeat(len - 2) + name.slice(-1)
}

/**
 * Masks a card number according to the desensitization rules.
 */
export function maskCardNo(card?: string): string {
  if (!card) return ''
  if (card.length === 9) {
    return card.slice(0, 2) + '*'.repeat(card.length - 4) + card.slice(-2)
  }
  if (card.startsWith('AE')) {
    return 'AE' + '*'.repeat(card.length - 4) + card.slice(-2)
  }
  return card.slice(0, 1) + '*'.repeat(card.length - 2) + card.slice(-1)
}



