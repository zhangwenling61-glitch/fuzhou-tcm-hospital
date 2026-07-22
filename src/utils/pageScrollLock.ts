import { onUnmounted, watch, type WatchSource } from 'vue'

let pageScrollLockCount = 0

function applyPageScrollLock(locked: boolean) {
  if (process.env.TARO_ENV !== 'weapp') return

  try {
    wx?.setPageStyle?.({
      style: {
        overflow: locked ? 'hidden' : 'auto'
      }
    })
  } catch (error) {
    console.warn('wx.setPageStyle scroll lock failed:', error)
  }
}

export function lockPageScroll() {
  if (process.env.TARO_ENV !== 'weapp') return

  pageScrollLockCount += 1
  if (pageScrollLockCount === 1) {
    applyPageScrollLock(true)
  }
}

export function unlockPageScroll() {
  if (process.env.TARO_ENV !== 'weapp') return
  if (pageScrollLockCount <= 0) return

  pageScrollLockCount -= 1
  if (pageScrollLockCount === 0) {
    applyPageScrollLock(false)
  }
}

export function usePageScrollLock(source: WatchSource<boolean>) {
  let locked = false

  const stop = watch(source, (shouldLock) => {
    if (shouldLock && !locked) {
      lockPageScroll()
      locked = true
      return
    }

    if (!shouldLock && locked) {
      unlockPageScroll()
      locked = false
    }
  }, { immediate: true })

  onUnmounted(() => {
    stop()
    if (locked) {
      unlockPageScroll()
      locked = false
    }
  })
}
