<template>
  <div class="portal-nav-bar" :style="{ height: navTotalHeightPx + 'px' }">
    <div
      class="portal-nav-bar__gradient"
      :class="{ 'is-secondary': secondary, 'is-immersive': immersive }"
      :style="gradientStyle"
    ></div>
    <div class="portal-nav-bar__content" :style="{ top: navTopPx + 'px', height: navHeightPx + 'px' }">
      <div v-if="secondary && !hideLeft" class="portal-nav-bar__left">
        <div class="portal-nav-bar__circle-btn" role="button" aria-label="返回" @click="handleBackClick">
          <img :src="iconBack" alt="返回">
        </div>
        <div class="portal-nav-bar__circle-btn" role="button" aria-label="返回皮肤科首页" @click="handleHomeClick">
          <img :src="iconHome" alt="首页">
        </div>
      </div>
      <h1 :class="{ 'is-light': immersive || (!forceDarkText && !secondary && (scrollTop || 0) <= 80) }">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import iconBack from '@/assets/icons/nav/arrow-left.svg'
import iconHome from '@/assets/icons/nav/house.svg'
import './index.less'

const props = withDefaults(defineProps<{
  title: string
  scrollTop?: number
  secondary?: boolean
  customBack?:() => boolean | void
  forceDarkText?: boolean
  immersive?: boolean
  hideLeft?: boolean
  homePath?: string
  navBackground?: string
}>(), {
  scrollTop: 0,
  secondary: false,
  forceDarkText: false,
  immersive: false,
  hideLeft: false,
  homePath: '/pages/home/index',
  navBackground: '#ffffff'
})

const emit = defineEmits<{
  layout: [payload: { height: number }]
}>()

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
// The WeChat capsule is only about 32px tall, while the custom circular
// back/home controls are 70px. On iOS preview, sizing the nav content from
// the capsule alone lets both controls overflow the nav box. Reserve the
// actual control height and move the top edge up by half the difference so
// the visual center stays aligned with the capsule center.
const navControlHeightPx = 70
const navHeightPx = Math.max(menuButtonInfo.height, navControlHeightPx)
const navTopPx = Math.max(
  0,
  menuButtonInfo.top - Math.max(0, (navHeightPx - menuButtonInfo.height) / 2)
)
const navTotalHeightPx = navTopPx + navHeightPx

const gradientStyle = computed(() => {
  const s = props.scrollTop
  if (props.immersive) {
    if (s <= 10) return 'opacity: 0; display: none;'
    if (s >= 90) return 'opacity: 1; background: linear-gradient(180deg, #457130 0%, #345424 100%) !important;'
    return `opacity: ${(s - 10) / 80}; background: linear-gradient(180deg, #457130 0%, #345424 100%) !important;`
  }
  if (props.secondary) {
    if (s <= 10) return `opacity: 0; background: ${props.navBackground};`
    if (s >= 50) return `opacity: 1; background: ${props.navBackground};`
    return `opacity: ${(s - 10) / 40}; background: ${props.navBackground};`
  }
  if (s <= 40) return `opacity: 0; background: ${props.navBackground};`
  if (s >= 140) return `opacity: 1; background: ${props.navBackground};`
  return `opacity: ${(s - 40) / 100}; background: ${props.navBackground};`
})

const triggerClickFeedback = () => {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
}

const handleBackClick = () => {
  triggerClickFeedback()
  goBack()
}

const handleHomeClick = () => {
  triggerClickFeedback()
  goHome()
}

const goBack = () => {
  // If a custom back interceptor is provided and returns true, prevent default back action
  if (props.customBack) {
    const isIntercepted = props.customBack()
    if (isIntercepted) return
  }

  const pages = Taro.getCurrentPages()
  if (pages.length > 1) {
    Taro.navigateBack()
    return
  }

  // Fallback routing for pages.length === 1 (direct load / developer tool hot reload / deep links)
  const currentPage = pages[pages.length - 1]
  const currentRoute = currentPage ? (currentPage.route || currentPage.$taroPath || '') : ''
  if (currentRoute) {
    if (currentRoute.includes('pages/common-list/article-detail')) {
      Taro.redirectTo({ url: '/pages/common-list/article-list/index' })
      return
    }
    if (currentRoute.includes('pages/common-list/article-list')) {
      Taro.reLaunch({ url: '/pages/home/index' })
      return
    }
    if (currentRoute.includes('pages/common-list') && !currentRoute.includes('pages/common-list/index')) {
      Taro.redirectTo({ url: '/pages/common-list/index' })
      return
    }
    if (currentRoute.includes('pages/common-list/index')) {
      Taro.redirectTo({ url: '/pages/user/index' })
      return
    }
  }

  Taro.reLaunch({ url: props.homePath })
}

const goHome = () => {
  if (props.homePath !== '/pages/home/index') {
    Taro.reLaunch({ url: props.homePath })
    return
  }
  const pages = Taro.getCurrentPages()
  const homeIndex = pages.findIndex(page => {
    const route = page.route || page.$taroPath || ''
    return route.includes('pages/home/index')
  })

  // Switch tab to 'home' first
  Taro.eventCenter.trigger('switchTab', 'home')

  if (homeIndex >= 0) {
    const delta = pages.length - 1 - homeIndex
    if (delta > 0) {
      Taro.navigateBack({ delta })
      return
    }
  }

  Taro.reLaunch({ url: '/pages/home/index' })
}

onMounted(() => {
  emit('layout', { height: navTotalHeightPx })
  if (props.immersive) {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#457130'
    }).catch(() => {})
  } else if (props.secondary) {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    }).catch(() => {})
  } else if (props.forceDarkText) {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ECF6E7'
    }).catch(() => {})
  } else {
    const isLight = (props.scrollTop || 0) <= 80
    Taro.setNavigationBarColor({
      frontColor: isLight ? '#ffffff' : '#000000',
      backgroundColor: isLight ? '#457130' : '#ffffff'
    }).catch(() => {})
  }
})

watch(() => props.scrollTop, (newVal) => {
  if (props.immersive) {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#457130'
    }).catch(() => {})
    return
  }
  if (props.secondary) return
  if (props.forceDarkText) {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ECF6E7'
    }).catch(() => {})
    return
  }
  const isLight = (newVal || 0) <= 80
  Taro.setNavigationBarColor({
    frontColor: isLight ? '#ffffff' : '#000000',
    backgroundColor: isLight ? '#457130' : '#ffffff'
  }).catch(() => {})
})
</script>
