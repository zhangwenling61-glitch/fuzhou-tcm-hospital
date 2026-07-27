<template>
  <div v-if="isWeapp" class="yh-host-page">
    <HomeTab
      :visible="true"
      :pageVisible="pageVisible"
      :scrollTop="activeScrollTop"
      :activeTab="activePortalTab"
      @tab-change="activePortalTab = $event"
    />

    <PortalActionSheet
      :show="store.showPatientSwitcher"
      title="切换就诊人"
      :actions="store.patients.map(p => p.name)"
      :value="store.activePatient.name"
      @update:show="store.showPatientSwitcher = $event"
      @select="handleSelectPatient"
    />

    <PortalTabbar
      :active="activePortalTab"
      :visible="pageVisible"
      @change="activePortalTab = $event"
    />
  </div>
  <div v-else class="yh-standalone-page">
    <!-- Non-WeChat platforms maintain separate pages -->
    <HomeTab
      :visible="true"
      :pageVisible="true"
      :scrollTop="0"
      :activeTab="activePortalTab"
      @tab-change="activePortalTab = $event"
    />
    <PortalTabbar
      :active="activePortalTab"
      :visible="true"
      @change="activePortalTab = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { usePageScroll, useDidShow, useDidHide } from '@tarojs/taro'
import { nextTick, onMounted, ref } from 'vue'
import { useAppStore } from '@/store'
import HomeTab from './components/HomeTab.vue'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import PortalTabbar from '@/components/PortalTabbar/index.vue'

const isWeapp = process.env.TARO_ENV === 'weapp'
const store = useAppStore()
const pageVisible = ref(true)
const activeScrollTop = ref(0)
const activePortalTab = ref<'home' | 'message' | 'user' | 'ai'>('home')
const hasCompletedFirstRender = ref(false)

onMounted(() => {
  // 小程序首屏渲染完成后再恢复本地状态，避免首个 setData 前发生响应式更新。
  nextTick(() => {
    if (isWeapp) {
      store.syncFromStorage()
      store.isSearchingGlobal = false
    }
    hasCompletedFirstRender.value = true
  })
})

useDidShow(() => {
  pageVisible.value = true
  // 首次进入由 onMounted 在首屏完成后处理；后续回到首页再即时刷新即可。
  if (isWeapp && hasCompletedFirstRender.value) {
    store.syncFromStorage()
    store.isSearchingGlobal = false
  }
})

useDidHide(() => {
  pageVisible.value = false
})

usePageScroll((res) => {
  if (isWeapp) {
    activeScrollTop.value = res.scrollTop
  }
})

const handleSelectPatient = (name: string) => {
  const target = store.patients.find(p => p.name === name)
  if (target) {
    store.switchPatient(target.id)
  }
  store.showPatientSwitcher = false
}
</script>

<style lang="less">
// Simple minimal wrapper styles to make host container 100% full screen
.yh-host-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
}
.yh-standalone-page {
  position: relative;
  width: 100%;
}
</style>
