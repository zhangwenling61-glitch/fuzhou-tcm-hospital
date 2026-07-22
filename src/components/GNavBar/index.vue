<template>
  <div
    v-if="process.env.TARO_ENV !== 'h5'"
    class="g-nav-bar"
    :class="bgClass"
  >
    <div class="status-bar" :style="{height: statusBarHeight + 'px'}" />
    <div class="nav-bar" :class="{ 'center': center }" :style="{height: height + 'px'}">
      <slot>
        <div class="nav-bar__icon">
          <van-icon name="arrow-left" @click="back" />
        </div>
        <span class="nav-bar__title">{{ title }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { Icon } from 'vant'
import './index.less'

defineProps<{
  opacity?: number
  title?: string
  center?: boolean
  bgClass?: string
}>()

const statusBarHeight = ref(20)
const height = ref(40)

Taro.getSystemInfo({
  success: (res) => {
    const { statusBarHeight: _statusBarHeight, titleBarHeight, system } = res as any
    statusBarHeight.value = _statusBarHeight
    height.value = titleBarHeight
    if (!height.value) {
      height.value = system.toLowerCase().indexOf('ios') > -1 ? 40 : 48
    }
  }
})

function back() {
  Taro.navigateBack()
}
</script>
