<template>
  <div class="winter-summer-page">
    <div v-if="isH5" class="winter-summer-page__h5-status">
      <span>12:34</span>
      <div class="winter-summer-page__h5-status-icons">
        <i class="winter-summer-page__wifi"></i>
        <i class="winter-summer-page__battery"></i>
      </div>
    </div>
    <div v-if="isH5" class="winter-summer-page__h5-capsule">
      <span></span>
      <span></span>
      <span></span>
      <i></i>
    </div>

    <PortalNavBar title="三伏灸活动" :scroll-top="scrollTop" nav-background="#feedd1" secondary force-dark-text />

    <img class="winter-summer-page__bg" :src="pageBg" mode="widthFix" alt="">
    <img class="winter-summer-page__top-bg" :src="topBg" mode="widthFix" alt="">

    <main class="winter-summer-page__content" :style="{ paddingTop: contentTop + 'px' }">
      <section class="winter-summer-page__hero">
        <img class="winter-summer-page__title-img" :src="titleImage" alt="冬病夏治三伏贴">
        <div class="winter-summer-page__subtitle">
          <span v-for="word in subtitleWords" :key="word">
            <img class="winter-summer-page__label-img" :src="labelSmallImage" alt="">
            <em>{{ word }}</em>
          </span>
        </div>
      </section>

      <section class="winter-summer-page__intro">
        <div class="winter-summer-page__section-title">
          <img class="winter-summer-page__section-title-bg" :src="sectionTitleImage" alt="">
          <span>什么是冬病夏治</span>
        </div>
        <div class="winter-summer-page__intro-card">
          <img class="winter-summer-page__panel-bg" :src="contentBgImage" alt="">
          <div class="winter-summer-page__intro-copy">
            <p>
              冬病夏治是中医<strong>“治未病”</strong>理念的典型体现，利用夏季气温高、阳气旺盛的特点，通过温阳散寒的方法，<strong>治疗冬季易发或加重的疾病</strong>。
            </p>
            <p>夏季阳气外浮，皮肤腠理开泄，是驱逐寒邪、调理体质的关键时期。</p>
          </div>
        </div>
      </section>

      <section class="winter-summer-page__consult">
        <img class="winter-summer-page__panel-bg" :src="cardBgImage" alt="">
        <img class="winter-summer-page__consult-icon" :src="doctorAvatar" mode="scaleToFill" alt="">
        <div class="winter-summer-page__consult-copy">
          <div class="winter-summer-page__consult-title">专业中医师在线咨询</div>
          <div class="winter-summer-page__consult-desc">帮您判断是否适合冬病夏治疗法</div>
        </div>
        <button class="winter-summer-page__consult-btn" type="button" @tap="handleConsult">立即咨询</button>
      </section>

      <section class="winter-summer-page__packages">
        <div class="winter-summer-page__packages-title">
          <span v-for="word in packageTitleWords" :key="word">
            <img class="winter-summer-page__label-img" :src="labelRedImage" alt="">
            <em>{{ word }}</em>
          </span>
        </div>

        <div class="winter-summer-page__hospital-tabs">
          <button
            v-for="hospital in hospitals"
            :key="hospital"
            class="winter-summer-page__hospital-tab"
            :class="{ 'is-active': activeHospital === hospital }"
            type="button"
            @tap="activeHospital = hospital"
          >
            {{ hospital }}
          </button>
        </div>

        <div class="winter-summer-page__package-list">
          <article
            v-for="item in filteredPackages"
            :key="`${item.id}-${activeHospital}`"
            class="winter-summer-page__package-card"
            :class="{ 'is-sold-out': item.stockState === 'sold-out' }"
          >
            <div class="winter-summer-page__package-cover">
              <img class="winter-summer-page__package-img" :src="moxaImage" alt="">
              <div class="winter-summer-page__package-hospital">{{ item.hospital }}</div>
            </div>
            <div
              v-if="item.stockLabel"
              class="winter-summer-page__package-stock"
              :class="{ 'is-sold-out': item.stockState === 'sold-out' }"
            >
              {{ item.stockLabel }}
            </div>
            <div class="winter-summer-page__package-info">
              <div class="winter-summer-page__package-name">{{ item.name }}</div>
              <div class="winter-summer-page__package-tags">
                <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="winter-summer-page__package-meta">
                <div>
                  <span class="winter-summer-page__package-price">¥{{ item.price }}</span>
                  <span class="winter-summer-page__package-origin">¥{{ item.originPrice }}</span>
                </div>
                <span class="winter-summer-page__package-sold">
                  <img class="winter-summer-page__package-sold-icon" :src="flameImage" alt="">
                  已售{{ item.sold }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <button class="winter-summer-page__order-btn" type="button" @tap="handleOrder">
      <img class="winter-summer-page__order-icon" :src="orderIconImage" alt="">
      我的订单
    </button>
  </div>
</template>

<script setup lang="ts">
import Taro, { usePageScroll } from '@tarojs/taro'
import { computed, ref } from 'vue'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import titleImage from '@/assets/images/winter-summer-treatment/title.png'
import moxaImage from '@/assets/images/winter-summer-treatment/moxa-card.jpg'
import pageBg from '@/assets/images/winter-summer-treatment/page-bg.jpg'
import topBg from '@/assets/images/winter-summer-treatment/top-bg.jpg'
import labelSmallImage from '@/assets/images/winter-summer-treatment/label-small.png'
import labelRedImage from '@/assets/images/winter-summer-treatment/label-red.png'
import sectionTitleImage from '@/assets/images/winter-summer-treatment/section-title-bg.png'
import contentBgImage from '@/assets/images/winter-summer-treatment/content-bg.png'
import cardBgImage from '@/assets/images/winter-summer-treatment/card-bg.png'
import flameImage from '@/assets/images/winter-summer-treatment/flame.png'
import orderIconImage from '@/assets/images/winter-summer-treatment/order-icon.png'
import doctorAvatar from '@/assets/images/winter-summer-treatment/doctor-avatar.png'
import './index.less'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const isH5 = process.env.TARO_ENV === 'h5'
const contentTop = isH5 ? 86 : menuButtonInfo.bottom + 10
const scrollTop = ref(0)
const activeHospital = ref('全部院区')

const subtitleWords = ['调', '理', '黄', '金', '期']
const packageTitleWords = ['精', '选', '服', '务', '包']
const hospitals = ['全部院区', '鼓楼院区', '五四北院区']

const packages = [
  {
    id: 'basic-1',
    hospital: '鼓楼院区',
    name: '三伏贴基础调理套餐',
    tags: ['6次穴位贴敷', '中医体质辨识'],
    price: 299,
    originPrice: 299,
    sold: 158,
    stockLabel: '仅剩2份',
    stockState: 'limited'
  },
  {
    id: 'basic-2',
    hospital: '鼓楼院区',
    name: '三伏贴基础调理套餐',
    tags: ['6次穴位贴敷', '中医体质辨识'],
    price: 299,
    originPrice: 299,
    sold: 158
  },
  {
    id: 'basic-3',
    hospital: '鼓楼院区',
    name: '三伏贴基础调理套餐',
    tags: ['6次穴位贴敷', '中医体质辨识'],
    price: 299,
    originPrice: 299,
    sold: 158
  },
  {
    id: 'basic-4',
    hospital: '五四北院区',
    name: '三伏贴基础调理套餐',
    tags: ['6次穴位贴敷', '中医体质辨识'],
    price: 299,
    originPrice: 299,
    sold: 158,
    stockLabel: '已售罄',
    stockState: 'sold-out'
  }
]

const filteredPackages = computed(() => {
  if (activeHospital.value === '全部院区') return packages
  return packages.filter(item => item.hospital === activeHospital.value)
})

usePageScroll((res) => {
  scrollTop.value = res.scrollTop || 0
})

const handleConsult = () => {
  Taro.navigateTo({
    url: '/pages/appointment/department/index?mode=consult',
    fail() {
      Taro.showToast({ title: '咨询服务建设中', icon: 'none' })
    }
  })
}

const handleOrder = () => {
  Taro.showToast({ title: '订单功能建设中', icon: 'none' })
}
</script>
