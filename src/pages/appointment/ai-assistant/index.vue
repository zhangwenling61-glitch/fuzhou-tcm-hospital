<template>
  <view
    :class="['yh-secondary-page', 'ai-assistant-page', { 'is-mounted': isAiMounted }]"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar
      title="仙草AI助手"
      :scroll-top="0"
      nav-background="#ecf6e7"
      secondary
    />

    <view class="ai-assistant-page__content">
      <!-- Centered Avatar -->
      <view class="ai-assistant-page__avatar-wrap">
        <view class="ai-assistant-page__avatar" aria-label="AI智能助手"></view>
      </view>

      <!-- Symmetrical Floating Balloon Bubbles -->
      <view class="ai-assistant-page__bubbles">
        <button
          v-for="item in displayBubbles"
          :key="item.id"
          class="ai-assistant-page__bubble-item"
          :class="[`is-bubble-${item.slotIndex}`, { 'is-leaving': item.isLeaving }]"
          type="button"
          @tap="handleBubbleTap(item)"
        ><text>{{ item.text }}</text></button>
      </view>
    </view>

    <!-- Speak Tip above button -->
    <view
      v-if="isRecording"
      class="ai-assistant-page__speak-tip"
      :class="{ 'is-cancel': isCancelState }"
    >
      <text>{{ isCancelState ? '松开手指，取消发送' : '松开发送，上滑取消' }}</text>
    </view>

    <!-- Footer Button -->
    <button
      class="ai-assistant-page__footer"
      :class="{ 'is-recording': isRecording, 'is-cancel': isCancelState }"
      type="button"
      @touchstart="handleSpeakStart"
      @touchmove="handleSpeakMove"
      @touchend="handleSpeakEnd"
    >
      <template v-if="isRecording && !isCancelState">
        <view class="voice-wave">
          <view class="voice-wave__bar"></view>
          <view class="voice-wave__bar"></view>
          <view class="voice-wave__bar"></view>
          <view class="voice-wave__bar"></view>
          <view class="voice-wave__bar"></view>
        </view>
      </template>
      <template v-else-if="isRecording && isCancelState">
        <text class="speak-cancel-text">松开取消</text>
      </template>
      <template v-else>
        <text>按住说话</text>
      </template>
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Taro from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './index.less'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16

const isRecording = ref(false)
const isCancelState = ref(false)
const startY = ref(0)
const isAiMounted = ref(false)

interface BubbleItem {
  id: number
  text: string
  isLeaving?: boolean
  slotIndex: number // 1 to 8
  action?: () => void
}

const bubblePool = [
  {
    id: 1,
    text: '我要去预约挂号，帮我跳转到挂号页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/appointment/department/index',
        fail(err) {
          console.error(`Navigate to /pages/appointment/department/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 2,
    text: '我要去结算，你帮我跳转到结算页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/settlement-payment/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/settlement-payment/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
          Taro.navigateTo({
            url: '/pages/common-list/settle-record/index',
            fail(fallbackErr) {
              console.error(`Navigate to fallback /pages/common-list/settle-record/index failed. Page stack: ${Taro.getCurrentPages().length}`, fallbackErr)
            }
          })
        }
      })
    }
  },
  {
    id: 3,
    text: '我想在手机上配药，帮我跳转到配药页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/medication-refill/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/medication-refill/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 4,
    text: '我看完医生要取药，帮我打开取药页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/pickup-medicine/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/pickup-medicine/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 5,
    text: '我的体检报告出来了，我想查询一下报告',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/report-list/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/report-list/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 6,
    text: '我已经到医院了，帮我办理门诊签到',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/appointment-signin/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/appointment-signin/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 7,
    text: '我想开具检查单，帮我打开检查开单页面',
    action: () => {
      Taro.navigateTo({
        url: '/pages/common-list/self-order/index',
        fail(err) {
          console.error(`Navigate to /pages/common-list/self-order/index failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  },
  {
    id: 8,
    text: '我想申请在线复诊，帮我选择复诊科室',
    action: () => {
      Taro.navigateTo({
        url: '/pages/appointment/department/index?mode=consult',
        fail(err) {
          console.error(`Navigate to /pages/appointment/department/index?mode=consult failed. Page stack: ${Taro.getCurrentPages().length}`, err)
        }
      })
    }
  }
]

const displayBubbles = ref<BubbleItem[]>([])
let bubbleCounter = 1
let timer: any = null

function initDisplayBubbles() {
  const list: BubbleItem[] = []
  for (let i = 0; i < 8; i++) {
    const poolItem = bubblePool[i % bubblePool.length]
    list.push({
      id: bubbleCounter++,
      text: poolItem.text,
      slotIndex: i + 1, // Start directly in their target slots
      action: poolItem.action
    })
  }
  displayBubbles.value = list
}

initDisplayBubbles()

function startScrollLoop() {
  timer = setInterval(() => {
    scrollOneStep()
  }, 2000) // Scroll every 2 seconds
}

function scrollOneStep() {
  if (displayBubbles.value.length < 8) return

  // 1. Mark the first element as leaving (margin-top collapses to hide it)
  displayBubbles.value[0].isLeaving = true

  // 2. Animate all elements' classes to shift opacities and scales
  for (let i = 0; i < displayBubbles.value.length; i++) {
    displayBubbles.value[i].slotIndex = i // Item 0 -> slot 0, Item 1 -> slot 1, etc.
  }

  // 3. Wait for the transition to finish (600ms)
  setTimeout(() => {
    // Remove the first item from the array (which is now completely hidden)
    const leavingItem = displayBubbles.value.shift()
    if (leavingItem) {
      leavingItem.isLeaving = false

      // Get the next pool item text to keep it infinite
      const poolIndex = (bubbleCounter - 1) % bubblePool.length
      const poolItem = bubblePool[poolIndex]
      const newItem: BubbleItem = {
        id: bubbleCounter++,
        text: poolItem.text,
        slotIndex: 8, // Start hidden off-screen
        action: poolItem.action
      }
      displayBubbles.value.push(newItem)
    }

    // Reset slotIndex for all current elements to their static slots
    for (let i = 0; i < displayBubbles.value.length; i++) {
      displayBubbles.value[i].slotIndex = i + 1
    }
  }, 600)
}

function handleBubbleTap(item: BubbleItem) {
  Taro.vibrateShort({ type: 'light' }).catch(() => {})
  if (item.action) {
    item.action()
  } else {
    Taro.showToast({
      title: `咨询“${item.text.slice(0, 8)}...”功能建设中`,
      icon: 'none'
    })
  }
}

function handleSpeakStart(e: any) {
  isRecording.value = true
  isCancelState.value = false
  if (e.touches && e.touches[0]) {
    startY.value = e.touches[0].clientY
  }
  Taro.vibrateShort({ type: 'medium' }).catch(() => {})
}

function handleSpeakMove(e: any) {
  if (!isRecording.value) return
  if (e.touches && e.touches[0]) {
    const currentY = e.touches[0].clientY
    const deltaY = startY.value - currentY
    // If user slides finger up by more than 60px
    if (deltaY > 60) {
      if (!isCancelState.value) {
        isCancelState.value = true
        Taro.vibrateShort({ type: 'light' }).catch(() => {})
      }
    } else {
      if (isCancelState.value) {
        isCancelState.value = false
      }
    }
  }
}

function handleSpeakEnd() {
  if (!isRecording.value) return
  isRecording.value = false
  if (isCancelState.value) {
    isCancelState.value = false
    Taro.showToast({
      title: '已取消发送',
      icon: 'none',
      duration: 1000
    })
  } else {
    Taro.showToast({
      title: '语音发送成功',
      icon: 'success',
      duration: 1000
    })
  }
}

onMounted(() => {
  // Start vertical marquee scrolling loop immediately on mount
  startScrollLoop()
  Taro.nextTick(() => {
    setTimeout(() => {
      isAiMounted.value = true
    }, 50)
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
