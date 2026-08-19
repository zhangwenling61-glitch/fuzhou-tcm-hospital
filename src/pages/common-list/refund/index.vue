<template>
  <div class="yh-secondary-page refund-showcase-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="预交金退款" :scroll-top="scrollTop" secondary force-dark-text />

    <main class="yh-secondary-content refund-showcase-content">
      <nav class="refund-showcase-tabs" aria-label="动图版本">
        <button
          v-for="item in showcaseItems"
          :key="item.id"
          class="refund-showcase-tab"
          :class="{ 'is-active': activeId === item.id }"
          type="button"
          @tap="activeId = item.id"
        >
          {{ item.tabLabel }}
        </button>
      </nav>

      <section class="refund-showcase-preview">
        <header class="refund-showcase-heading">
          <h1>{{ activeItem.title }}</h1>
          <span>{{ activeItem.sizeLabel }}</span>
        </header>

        <div
          class="refund-showcase-media"
          :class="`is-${activeItem.aspect}`"
        >
          <video
            v-if="activeItem.type === 'video'"
            id="refundShowcaseVideo"
            :key="activeItem.id"
            class="refund-showcase-video"
            :src="activeItem.src"
            :poster="activeItem.poster"
            :autoplay="true"
            :loop="true"
            :muted="true"
            :controls="false"
            :show-center-play-btn="false"
            :show-play-btn="false"
            :enable-progress-gesture="false"
            object-fit="contain"
            @loadedmetadata="playActiveVideo"
          />
          <img
            v-else
            :key="activeItem.id"
            class="refund-showcase-image"
            :src="activeItem.src"
            mode="aspectFit"
            alt=""
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './index.less'

type ShowcaseItem = {
  id: string
  tabLabel: string
  title: string
  sizeLabel: string
  type: 'video' | 'image'
  aspect: 'portrait' | 'wide'
  src: string
  poster?: string
}

const mediaBaseUrl = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E9%A6%96%E9%A1%B5/%E9%A2%84%E4%BA%A4%E9%87%91%E9%80%80%E6%AC%BE%E5%85%A5%E5%8F%A3'

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'latest',
    tabLabel: '最新版',
    title: 'Banner 最新版',
    sizeLabel: '1080 × 844',
    type: 'video',
    aspect: 'portrait',
    src: `${mediaBaseUrl}/banner-latest-1080x844.mp4`,
    poster: `${mediaBaseUrl}/banner-latest-poster.jpg`
  },
  {
    id: 'gif',
    tabLabel: 'GIF 版',
    title: 'Banner GIF 版',
    sizeLabel: '1080 × 844',
    type: 'image',
    aspect: 'portrait',
    src: `${mediaBaseUrl}/banner-gif-1080x844.gif`
  },
  {
    id: 'first',
    tabLabel: '公众号底部版',
    title: '公众号底部动图',
    sizeLabel: '1080 × 433',
    type: 'video',
    aspect: 'wide',
    src: `${mediaBaseUrl}/banner-first-1080x433.mp4`,
    poster: `${mediaBaseUrl}/banner-first-poster.jpg`
  }
]

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)
const activeId = ref(showcaseItems[0].id)
const activeItem = computed(() => showcaseItems.find(item => item.id === activeId.value) || showcaseItems[0])

const playActiveVideo = () => {
  if (activeItem.value.type === 'video') {
    Taro.createVideoContext('refundShowcaseVideo').play()
  }
}

usePageScroll((res) => {
  scrollTop.value = res.scrollTop || 0
})
</script>
