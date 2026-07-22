<template>
  <div
    class="portal-tabbar-shell"
    :class="{
      'is-searching-active': store.isSearchingGlobal,
      'is-visible': isVisible
    }"
  >
    <div class="portal-tabbar-container">
      <div :class="['portal-tabbar', `is-active-${indicatorActiveIndex}`]">
        <span class="portal-tabbar__indicator">
          <span
            class="portal-tabbar__indicator-inner"
            :class="{ 'is-animating': animateIndicator }"
          ></span>
        </span>
        <div
          v-for="item in mainNavItems"
          :key="item.key"
          :class="['portal-tabbar__item', { 'is-active': item.key === visualActive }]"
          role="button"
          @tap.stop="onSwitch(item)"
        >
          <span class="portal-tabbar__item-bg"></span>
          <span class="portal-tabbar__content">
            <span class="portal-tabbar__icon">
              <img
                class="portal-tabbar__icon-img is-normal"
                :src="item.iconNormal"
                alt=""
              >
              <img
                class="portal-tabbar__icon-img is-active"
                :class="{ 'has-pop-animation': animateKey === item.key }"
                :src="item.iconActive"
                alt=""
              >
            </span>
            <span>{{ item.name }}</span>
          </span>
        </div>
      </div>

      <!-- Independent AI Assistant button on the right -->
      <div
        class="portal-tabbar__ai-wrap"
        role="button"
        @tap.stop="handleAiTap"
      >
        <div
          class="portal-tabbar__pet-sprite"
          :style="{ backgroundImage: `url(${hospitalAssistantAvatarImage})` }"
          aria-label="AI助手"
        ></div>

        <!-- Simple AI Assistant bubble tooltip -->
        <div
          class="portal-tabbar__ai-bubble"
          :class="[
            `is-state-${bubbleState}`,
            { 'is-visible': bubbleState !== 'hidden' }
          ]"
        >
          <span class="portal-tabbar__ai-bubble-text">{{ typedText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store'

const store = useAppStore()
const isVisible = ref(true)

import type { PropType } from 'vue'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import tabHomeNormal from '@/assets/images/Tabbar 标签栏/Property 1=首页(未选中).png'
import tabMessageNormal from '@/assets/images/Tabbar 标签栏/Property 1=消息(未选中).png'
import tabMineNormal from '@/assets/images/Tabbar 标签栏/Property 1=我的(未选中).png'
import './index.less'

type PortalTabKey = 'home' | 'message' | 'user' | 'ai'

const hospitalAssistantAvatarImage = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/ai%E4%BB%99%E8%8D%89.png?v=20260626-5'
const tabHomeActive = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/tabber/Property%201%3D%E9%A6%96%E9%A1%B5%E9%80%89%E4%B8%AD.png?v=2'
const tabMessageActive = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/tabber/Property%201%3D%E6%B6%88%E6%81%AF%E9%80%89%E4%B8%AD.png?v=2'
const tabMineActive = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/tabber/Property%201%3D%E6%88%91%E7%9A%84%E9%80%89%E4%B8%AD.png?v=2'

// 模块级别全局变量：跨页面实例共享活动 Tab 历史，实现跨页面指示器滑块动画
let lastActiveTab: PortalTabKey | '' = ''

const props = defineProps({
  active: {
    type: String as PropType<PortalTabKey>,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  beforeSwitch: {
    type: Function as PropType<() => void | Promise<void>>,
    default: undefined
  },
  onSwitchFail: {
    type: Function as PropType<() => void>,
    default: undefined
  }
})

const emit = defineEmits(['change'])

const navItems = [
  { key: 'home', name: '首页', iconNormal: tabHomeNormal, iconActive: tabHomeActive, url: '/pages/home/index' },
  { key: 'message', name: '消息', iconNormal: tabMessageNormal, iconActive: tabMessageActive, url: '/pages/message/index' },
  { key: 'user', name: '我的', iconNormal: tabMineNormal, iconActive: tabMineActive, url: '/pages/user/index' },
  {
    key: 'ai',
    name: 'AI助手',
    iconNormal: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/ai%E4%BB%99%E8%8D%89%E5%A4%A7%E5%A4%B4%E5%83%8F.png?v=20260626-2',
    iconActive: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/ai%E4%BB%99%E8%8D%89%E5%A4%A7%E5%A4%B4%E5%83%8F.png?v=20260626-2',
    url: ''
  }
] as const

const mainNavItems = computed(() => navItems.filter((item) => item.key !== 'ai'))
const aiNavItem = navItems.find((item) => item.key === 'ai')!
const pendingActive = ref<PortalTabKey | ''>('')
// 如果有历史激活 Tab 且与当前不同，则先将指示器初始化在旧位置，以在 mounted 时滑行到新位置
const indicatorActive = ref<PortalTabKey>(
  lastActiveTab && lastActiveTab !== props.active ? (lastActiveTab as PortalTabKey) : props.active
)
const animateKey = ref<PortalTabKey | ''>('')
const visualActive = computed(() => pendingActive.value || indicatorActive.value)
// Indicator only slides between the main tab keys
const indicatorActiveIndex = computed(() => {
  const idx = mainNavItems.value.findIndex((item) => item.key === indicatorActive.value)
  return idx === -1 ? 0 : idx
})
const isSwitching = ref(false)
const popTimeoutId = ref<any>(null)
const animateIndicator = ref(false)
const indicatorTimeoutId = ref<any>(null)

// ---- AI Assistant bubble tooltip states & timing logic ----
const bubbleState = ref<'hidden' | 'rising' | 'expanding' | 'fading-out'>('hidden')
const bubbleTextIndex = ref(0)
const typedText = ref('')
const bubbleTexts = [
  'Hi我是仙草AI助手',
  '有什么可以帮您？',
  '智能导诊为您服务',
  '点击开启AI咨询',
  '找科室、查报告？',
  '预约挂号我来帮您',
  '找医生诊前帮帮您',
  '诊前症状智能自测',
  '报告单解读省心看',
  '医保结算一键直达',
  '在线配药送药到家'
]

let isCycleRunning = false
let cycleTimeoutId: any = null
let typingTimeoutId: any = null

const clearBubbleTimers = () => {
  if (cycleTimeoutId) {
    clearTimeout(cycleTimeoutId)
    cycleTimeoutId = null
  }
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId)
    typingTimeoutId = null
  }
}

const typeWriter = (fullText: string, callback: () => void) => {
  typedText.value = ''
  let currentIdx = 0

  const tick = () => {
    if (!isCycleRunning) return
    if (currentIdx < fullText.length) {
      typedText.value = fullText.slice(0, currentIdx + 1)
      currentIdx++
      typingTimeoutId = setTimeout(tick, 70)
    } else {
      callback()
    }
  }

  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId)
  }
  tick()
}

const runBubbleCycle = () => {
  if (!isCycleRunning) return
  clearBubbleTimers()
  bubbleState.value = 'rising'
  typedText.value = ''

  cycleTimeoutId = setTimeout(() => {
    if (!isCycleRunning) return
    bubbleState.value = 'expanding'

    cycleTimeoutId = setTimeout(() => {
      if (!isCycleRunning) return
      const fullText = bubbleTexts[bubbleTextIndex.value]
      typeWriter(fullText, () => {
        cycleTimeoutId = setTimeout(() => {
          if (!isCycleRunning) return
          bubbleState.value = 'fading-out'

          cycleTimeoutId = setTimeout(() => {
            if (!isCycleRunning) return
            bubbleState.value = 'hidden'
            typedText.value = ''

            cycleTimeoutId = setTimeout(() => {
              if (!isCycleRunning) return
              bubbleTextIndex.value = (bubbleTextIndex.value + 1) % bubbleTexts.length
              runBubbleCycle()
            }, 2000)
          }, 400)
        }, 1200)
      })
    }, 50)
  }, 700)
}

const stopBubbleCycle = () => {
  isCycleRunning = false
  clearBubbleTimers()
  bubbleState.value = 'hidden'
  typedText.value = ''
}

const startBubbleCycle = () => {
  stopBubbleCycle()
  if (props.active !== 'home') {
    return
  }
  if (props.visible && props.active === 'home') {
    isCycleRunning = true
    cycleTimeoutId = setTimeout(() => {
      runBubbleCycle()
    }, 1000)
  }
}

// Watch both visible state and active tab changes
watch(
  [() => props.visible, () => props.active],
  ([visible, active]) => {
    if (visible && active === 'home') {
      startBubbleCycle()
    } else {
      stopBubbleCycle()
    }
  }
)

watch(
  () => props.active,
  (newVal) => {
    pendingActive.value = ''
    indicatorActive.value = newVal

    // Trigger indicator stretch animation
    if (indicatorTimeoutId.value) {
      clearTimeout(indicatorTimeoutId.value)
    }
    animateIndicator.value = true
    indicatorTimeoutId.value = setTimeout(() => {
      animateIndicator.value = false
    }, 380)

    // Trigger icon pop animation
    if (popTimeoutId.value) {
      clearTimeout(popTimeoutId.value)
    }
    animateKey.value = newVal
    popTimeoutId.value = setTimeout(() => {
      if (animateKey.value === newVal) {
        animateKey.value = ''
      }
    }, 450)
  }
)

onMounted(() => {
  // 如果是从其它 Tab 切换过来的，触发平滑 of 滑块滑动动画
  if (lastActiveTab && lastActiveTab !== props.active) {
    setTimeout(() => {
      indicatorActive.value = props.active

      // Trigger indicator stretch animation on mount slide
      if (indicatorTimeoutId.value) {
        clearTimeout(indicatorTimeoutId.value)
      }
      animateIndicator.value = true
      indicatorTimeoutId.value = setTimeout(() => {
        animateIndicator.value = false
      }, 380)
    }, 50)
  }

  // 延迟播放图标 of 微动/弹性动画，保证与滑块动作协同
  if (popTimeoutId.value) {
    clearTimeout(popTimeoutId.value)
  }
  setTimeout(() => {
    animateKey.value = props.active
    popTimeoutId.value = setTimeout(() => {
      if (animateKey.value === props.active) {
        animateKey.value = ''
      }
    }, 450)
  }, 50)

  // 始终将当前 active 存入历史记录中
  lastActiveTab = props.active
  startBubbleCycle()

  // Set visible on next tick to trigger CSS transitions
  setTimeout(() => {
    isVisible.value = true
  }, 40)
})

onUnmounted(() => {
  stopBubbleCycle()
  if (popTimeoutId.value) {
    clearTimeout(popTimeoutId.value)
  }
  if (indicatorTimeoutId.value) {
    clearTimeout(indicatorTimeoutId.value)
  }
})

const handleAiTap = () => {
  onSwitch(aiNavItem)
}

const onSwitch = async(item: typeof navItems[number]) => {
  if (item.key === 'ai') {
    Taro.vibrateShort({ type: 'light' }).catch(() => {})
    Taro.navigateTo({
      url: '/pages/appointment/ai-assistant/index',
      fail(err) {
        console.error('Navigate to AI assistant page failed', err)
      }
    })
    return
  }

  if (item.key === visualActive.value) {
    return
  }
  if (isSwitching.value) {
    return
  }

  // 触发物理微震动触觉反馈 (Light haptic feedback for supported devices)
  Taro.vibrateShort({ type: 'light' }).catch(() => {})

  isSwitching.value = true
  pendingActive.value = item.key
  // Keep indicatorActive at current props.active on the current page to prevent
  // double-animation position jumps during redirects.
  animateKey.value = item.key

  // 记录离开前的 Tab
  lastActiveTab = props.active

  // Emit tab change event and let the parent component switch the tab view immediately
  try {
    if (props.beforeSwitch) {
      await props.beforeSwitch()
    }
    emit('change', item.key)
  } catch (e) {
    props.onSwitchFail?.()
  } finally {
    isSwitching.value = false
    pendingActive.value = ''
  }
}
</script>
