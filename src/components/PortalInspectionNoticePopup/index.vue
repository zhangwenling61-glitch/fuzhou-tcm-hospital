<template>
  <!-- If notice is scrollable (long content), allow touchmove propagation for internal scrolling -->
  <div
    v-if="isNoticeScrollable"
    class="portal-inspection-popup"
    :class="{ 'is-closing': isClosing, 'is-green': theme === 'green' }"
    @touchmove="handleTouchMove"
  >
    <div
      class="portal-inspection-popup__mask"
      @touchmove.stop.prevent
      @click="handleClose"
    ></div>
    <section
      class="portal-inspection-popup__sheet"
      :class="{ 'is-compact': resolvedHeightMode === 'compact' }"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <img
        class="portal-inspection-popup__corner"
        :src="cornerBlue"
        alt=""
        @touchmove.stop.prevent
      >
      <div
        class="portal-inspection-popup__illustration"
        aria-hidden="true"
        @touchmove.stop.prevent
      >
        <img class="portal-inspection-popup__clipboard" :src="clipboard" alt="">
      </div>
      <img
        class="portal-inspection-popup__bg"
        :src="sheetBg"
        alt=""
        @touchmove.stop.prevent
      >

      <div
        class="portal-inspection-popup__content"
        :class="{
          'is-scrolled': isNoticeScrolled && isNoticeScrollable,
          'is-scrollable': isNoticeScrollable
        }"
      >
        <h3>{{ title }}</h3>
        <scroll-view
          ref="noticeScrollRef"
          :scroll-y="isNoticeScrollable"
          class="portal-inspection-popup__scroll"
          :bounces="false"
          @scroll="handleNoticeScroll"
        >
          <div ref="noticeListRef" class="portal-inspection-popup__list">
            <p v-for="(item, index) in noticeItems" :key="index" v-html="item"></p>
          </div>
        </scroll-view>
      </div>

      <div class="portal-inspection-popup__action" @touchmove.stop.prevent>
        <PortalButton text="我知道了" @click="handleClose" />
      </div>
    </section>
  </div>

  <!-- If notice is NOT scrollable (short content), completely prevent touchmove natively to lock background page -->
  <div
    v-else
    class="portal-inspection-popup"
    :class="{ 'is-closing': isClosing, 'is-green': theme === 'green' }"
    catch-move
    catchtouchmove="handleTouchMove"
    @touchmove.stop.prevent
  >
    <div
      class="portal-inspection-popup__mask"
      catch-move
      catchtouchmove="handleTouchMove"
      @touchmove.stop.prevent
      @click="handleClose"
    ></div>
    <section
      class="portal-inspection-popup__sheet"
      :class="{ 'is-compact': resolvedHeightMode === 'compact' }"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <img
        class="portal-inspection-popup__corner"
        :src="cornerBlue"
        alt=""
      >
      <div
        class="portal-inspection-popup__illustration"
        aria-hidden="true"
      >
        <img class="portal-inspection-popup__clipboard" :src="clipboard" alt="">
      </div>
      <img
        class="portal-inspection-popup__bg"
        :src="sheetBg"
        alt=""
      >

      <div
        class="portal-inspection-popup__content"
        :class="{
          'is-scrolled': isNoticeScrolled && isNoticeScrollable,
          'is-scrollable': isNoticeScrollable
        }"
      >
        <h3>{{ title }}</h3>
        <scroll-view
          ref="noticeScrollRef"
          :scroll-y="isNoticeScrollable"
          class="portal-inspection-popup__scroll"
          :bounces="false"
          @scroll="handleNoticeScroll"
        >
          <div ref="noticeListRef" class="portal-inspection-popup__list">
            <p v-for="(item, index) in noticeItems" :key="index" v-html="item"></p>
          </div>
        </scroll-view>
      </div>

      <div class="portal-inspection-popup__action">
        <PortalButton text="我知道了" @click="handleClose" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import sheetBg from '@/assets/images/popup/inspection-notice/sheet-bg.svg'
import cornerBlue from '@/assets/images/popup/inspection-notice/corner-blue.svg'
import PortalButton from '@/components/PortalButton/index.vue'
import { usePageScrollLock } from '@/utils/pageScrollLock'
const clipboard = 'https://foruda.gitee.com/images/1779469644829377197/8f3040e7_16918445.png'
import './index.less'

const props = withDefaults(defineProps<{
  heightMode?: 'max' | 'compact'
  contentMode?: 'short' | 'full'
  theme?: 'blue' | 'green'
  title?: string
  items?: string[]
}>(), {
  heightMode: 'max',
  contentMode: 'full',
  theme: 'blue',
  title: '检查检验开单须知'
})

const emit = defineEmits(['confirm'])

const isClosing = ref(false)
const isPopupVisible = ref(true)

usePageScrollLock(isPopupVisible)

const handleClose = () => {
  if (isClosing.value) return
  isClosing.value = true
  setTimeout(() => {
    emit('confirm')
  }, 300)
}

const isNoticeScrolled = ref(false)

const fullNoticeItems = [
  '1.仅提供检验检查开单、预约，不提供开药服务。',
  '2.仅针对微信实名与电子医保实名一致的人员，暂不支持亲情代办，也不支持特殊病种。',
  '3.点击进入模块，与医生沟通后，由医生为您开单并协助预约。请在<strong>开单后1小时内完成结算</strong>，以免预约失效。',
  '4.问诊收取<strong>18元诊查费</strong>。',
  '5.查项目可预约未来两周内的时间，请根据自身情况合理选择。',
  '6.本服务所开检验检查项目限<strong>在金山院区执行</strong>，部分特殊项目需线下预约。',
  '7.本服务所开检验检查项目限在金山院区执行，部分特殊项目需线下预约。',
  '8.本服务所开检验检查项目限在金山院区执行，部分特殊项目需线下预约。',
  '9.预约成功后，请按预约时间到达对应检查区域，迟到可能影响当日检查安排。',
  '10.如检查前需空腹、憋尿或其他准备，请以医生开单说明和院内短信提醒为准。',
  '11.部分检查项目需完成缴费后方可生成预约号，请在支付完成后返回查看预约结果。',
  '12.如因设备维护、医生复核或院区排班调整导致预约变更，医院将通过服务通知告知。',
  '13.检查结果出具时间以实际项目为准，可在智慧医院首页或报告查询入口查看。',
  '14.继续进入即表示您已阅读并理解上述须知，同意按流程完成开单、结算和预约。'
]

const shortNoticeItems = fullNoticeItems.slice(0, 4)

const noticeItems = computed(() => {
  if (props.items) return props.items
  return props.contentMode === 'short' ? shortNoticeItems : fullNoticeItems
})

const isLongContent = computed(() => {
  const totalLength = noticeItems.value.reduce((acc, cur) => acc + cur.length, 0)
  return noticeItems.value.length > 5 || totalLength > 120
})

// Compute scrollability directly based on content length or character count
const isNoticeScrollable = computed(() => {
  return isLongContent.value
})

// Resolve compact vs max height modes cleanly
const resolvedHeightMode = computed(() => {
  if (isLongContent.value) {
    return 'max'
  }
  return props.heightMode ?? 'compact'
})

const handleNoticeScroll = (e: any) => {
  const scrollTop = e.detail ? e.detail.scrollTop : (e.target ? e.target.scrollTop : 0)
  isNoticeScrolled.value = scrollTop > 6
}

const handleTouchMove = (e: any) => {
  if (!isNoticeScrollable.value) {
    e.stopPropagation()
    e.preventDefault()
  }
}
</script>
