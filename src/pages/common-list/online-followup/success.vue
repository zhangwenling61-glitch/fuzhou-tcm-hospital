<template>
  <view
    class="yh-secondary-page online-followup-success-page"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="提交成功" :scroll-top="scrollTop" secondary force-dark-text />

    <PortalSuccessResult
      title="问诊单已提交"
      desc="医生将在 5 分钟内接诊，请保持手机畅通"
      :icon="successIcon"
      :rows="resultRows"
      theme="green"
      inline-actions
      left-text="返回科室"
      right-text="查看记录"
      @cancel="goDepartment"
      @confirm="viewRecords"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalSuccessResult from '@/components/PortalSuccessResult/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './success.less'

interface ConsultResultRow {
  label: string
  value: string
  highlight?: boolean
}

interface ConsultSuccessData {
  orderNo?: string
  departmentName?: string
  symptomText?: string
  expectedFee?: string
  status?: string
}

const successIcon = 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E7%A6%8F%E5%B7%9E%E4%B8%AD%E5%8C%BB%E9%99%A2/%E5%85%A8%E5%B1%80/%E6%88%90%E5%8A%9F.png?v=20260821105654'
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 8
const scrollTop = ref(0)
const successData = Taro.getStorageSync('online_consult_disease_form') as ConsultSuccessData || {}

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

const symptomSummary = computed(() => {
  const text = (successData.symptomText || '').replace(/\s+/g, ' ').trim()
  if (!text) return '—'
  return text.length > 14 ? `${text.slice(0, 14)}...` : text
})

const resultRows = computed<ConsultResultRow[]>(() => [
  { label: '问诊单号', value: successData.orderNo || '—' },
  { label: '问诊科室', value: successData.departmentName || '—' },
  { label: '主要症状', value: symptomSummary.value },
  { label: '预计费用', value: successData.expectedFee || '¥20.00', highlight: true },
  { label: '状态', value: successData.status || '待医生接诊', highlight: true }
])

function goDepartment() {
  Taro.reLaunch({
    url: '/pages/appointment/department/index?mode=consult',
    fail(err) {
      console.error('reLaunch to consult department fail:', err)
    }
  })
}

function viewRecords() {
  Taro.showToast({ title: '问诊记录已保存', icon: 'success' })
}
</script>
