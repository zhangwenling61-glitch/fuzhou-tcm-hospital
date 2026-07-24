<template>
  <div class="portal-segment-nav">
    <PortalNavBar :title="title" :scroll-top="scrollTop" :secondary="secondary" :force-dark-text="forceDarkText" />

    <!-- 毛玻璃底层（z-index 19，在 PortalNavBar 下方，不遮挡标题和按钮） -->
    <div class="portal-segment-nav__glass-wrapper">
      <div class="portal-segment-nav__glass" :style="glassStyle"></div>
    </div>

    <!-- Segment 按钮（z-index 21，在 PortalNavBar 渐变上方） -->
    <div
      class="portal-segment-nav__segment"
      :style="{ top: segmentTopPx + 'px' }"
    >
      <!-- Absolutely positioned sliding active pill background -->
      <div
        class="portal-segment-nav__active-bg"
        :style="activeBgStyle"
      ></div>

      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ 'is-active': activeTab === tab.key }"
        type="button"
        @click="$emit('update:activeTab', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Taro from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './index.less'

export interface SegmentTab {
  key: string
  label: string
}

const props = withDefaults(defineProps<{
  /** 导航栏标题 */
  title: string
  /** 切换 tab 配置 */
  tabs: SegmentTab[]
  /** 当前选中 tab 的 key */
  activeTab: string
  /** 当前页面 scrollTop，驱动毛玻璃渐显 */
  scrollTop?: number
  /** 是否为二级页面（true 显示返回+主页按钮，false 不显示） */
  secondary?: boolean
  /** 强制使用深色字 */
  forceDarkText?: boolean
}>(), {
  scrollTop: 0,
  secondary: false,
  forceDarkText: false
})

defineEmits(['update:activeTab'])

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
// 导航栏底部 + Figma 8px @1x
const segmentTopPx = menuButtonInfo.bottom + 8

// Dynamically scale 84rpx Less unit height into exact physical pixels based on device viewport
const getPhysicalSegmentHeight = () => {
  try {
    const sys = Taro.getSystemInfoSync()
    return (84 * sys.windowWidth) / 750
  } catch (e) {
    return 42
  }
}
const segmentHeightPx = getPhysicalSegmentHeight()
// segment 按钮高度 + Figma 8px @1x (= 16rpx = 8px)
const contentTop = segmentTopPx + segmentHeightPx + 8

// Calculate active tab index for sliding animation
const activeIdx = computed(() => {
  return props.tabs.findIndex(tab => tab.key === props.activeTab)
})

// Clean and highly robust inline styling computation for active bg alignment with equal 8px spaces (Taro.pxTransform)
const activeBgStyle = computed(() => {
  const len = props.tabs.length
  const idx = activeIdx.value

  const totalPadding = 8 * (len + 1)
  const widthStr = `calc((100% - ${Taro.pxTransform(totalPadding)}) / ${len})`

  let leftStr = Taro.pxTransform(8)
  if (idx > 0) {
    if (len === 2 && idx === 1) {
      leftStr = `calc(50% + ${Taro.pxTransform(4)})` // Perfectly symmetrical design offset
    } else {
      leftStr = `calc(${Taro.pxTransform(8)} + ${idx} * ((100% - ${Taro.pxTransform(totalPadding)}) / ${len} + ${Taro.pxTransform(8)}))`
    }
  }

  return {
    width: widthStr,
    left: leftStr
  }
})

// 毛玻璃样式：跟随 scrollTop 渐显
const glassStyle = computed(() => {
  const s = props.scrollTop
  if (s <= 40) return 'opacity: 0;'
  if (s >= 140) return 'opacity: 1;'
  return `opacity: ${(s - 40) / 100};`
})

defineExpose({
  /** 内容区域的起始位置（px），页面需要将此值设为 paddingTop */
  contentTop,
  /** segment 按钮的 top 位置（px） */
  segmentTopPx
})
</script>
