<template>
  <view
    class="yh-secondary-page appointment-result-page"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="预约信息" :scroll-top="scrollTop" secondary />

    <PortalSuccessResult
      v-if="status === 'success'"
      title="预约成功"
      desc="请在就诊时间前5分钟提前在门诊取号"
      :rows="resultRows"
      left-text="返回首页"
      right-text="查看我的预约"
      @cancel="goHome"
      @confirm="goNext"
    />
    <PortalSuccessResult
      v-else
      title="预约失败"
      desc="当前遇到了不可预知的问题，请重试"
      :rows="[]"
      left-text="返回首页"
      right-text="重新预约"
      @cancel="goHome"
      @confirm="goNext"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro, { useLoad, usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalSuccessResult from '@/components/PortalSuccessResult/index.vue'
import { useAppStore } from '@/store'
import { getRouteUrl, getSafeMenuButtonBoundingClientRect, maskName } from '@/utils'
import { doctors, routeMap, getDoctorById } from '../mock'
import '../common.less'
import './index.less'

interface SuccessResultRow {
  label: string
  value: string | number
  highlight?: boolean
}

const store = useAppStore()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 8
const scrollTop = ref(0)
const status = ref<'success' | 'fail'>('success')

const doctorId = ref('')
const campus = ref('')
const slotTime = ref('2026/05/27 08:30')
const customDeptName = ref('')
const baseDoctor = ref<any>(doctors[0] || {})

const doctor = computed(() => {
  const doc = baseDoctor.value || {}
  const deptName = customDeptName.value || doc.clinic || doc.department || '非病毒性肝病科'
  return {
    ...doc,
    clinic: deptName,
    department: deptName
  }
})

useLoad(query => {
  status.value = query.status === 'fail' ? 'fail' : 'success'
  if (query.deptName) {
    try {
      customDeptName.value = decodeURIComponent(query.deptName)
    } catch (e) {
      customDeptName.value = query.deptName
    }
  } else {
    customDeptName.value = ''
  }

  if (query.doctorId) {
    try {
      doctorId.value = decodeURIComponent(query.doctorId)
    } catch (e) {
      doctorId.value = query.doctorId
    }
    const doc = getDoctorById(doctorId.value) || doctors.find(d => decodeURIComponent(d.id) === doctorId.value) || doctors[0] || {}
    if (doc) baseDoctor.value = doc
  }
  if (query.campus) {
    try {
      campus.value = decodeURIComponent(query.campus)
    } catch (e) {
      campus.value = query.campus
    }
  }
  if (query.slotTime) {
    try {
      slotTime.value = decodeURIComponent(query.slotTime)
    } catch (e) {
      slotTime.value = query.slotTime
    }
  }
})

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

const formatCardNo = (card: string) => {
  if (!card) return ''
  if (card.length === 9) {
    return card.slice(0, 2) + '*****' + card.slice(-2)
  }
  return card.slice(0, 3) + '******' + card.slice(-3)
}

const patientDisplayName = computed(() => {
  const patient = store.activePatient
  if (patient) {
    return `${maskName(patient.name)}(${formatCardNo(patient.cardNo)})`
  }
  return '孔*雯(DG44*****86)'
})

const resultRows = computed<SuccessResultRow[]>(() => {
  const doc = doctor.value || {}
  return [
    { label: '诊室位置', value: doc.clinic === '重症肝病科' ? '门诊楼二楼 218诊室' : (doc.clinic === '皮肤病普通门诊' ? '门诊楼三楼 302诊室' : '门诊楼四楼 406诊室'), highlight: true },
    { label: '预约时间', value: slotTime.value, highlight: true },
    { label: '就诊人', value: patientDisplayName.value },
    { label: '预约医生', value: `${doc.name || ''} ${doc.title || ''}`.trim() || '宋元林 主任医师' },
    { label: '预约科室', value: doc.clinic || doc.department || '非病毒性肝病科' },
    { label: '预约序号', value: '12号' },
    { label: '诊查费', value: doc.consultPrice || '50元' }
  ]
})

function goHome() {
  Taro.reLaunch({ url: getRouteUrl(routeMap.home) })
}

function goNext() {
  Taro.reLaunch({
    url: getRouteUrl(status.value === 'success' ? routeMap.my : routeMap.detail)
  })
}
</script>
