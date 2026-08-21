<template>
  <div class="yh-secondary-page online-consult-history-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="历史病情" :scroll-top="scrollTop" secondary force-dark-text />

    <div class="yh-secondary-content online-consult-history-content">
      <div class="yh-secondary-list-stack">
        <section
          v-for="item in historyRecords"
          :key="item.id"
          class="yh-secondary-card yh-secondary-card-flow history-disease-card"
          @tap="importRecord(item)"
        >
          <div class="history-disease-card__header">
            <div class="history-disease-card__patient">
              <img class="history-disease-card__avatar" :src="item.avatar" alt="">
              <div class="history-disease-card__patient-info">
                <div class="history-disease-card__name-row">
                  <span class="history-disease-card__name">{{ item.patientName }}，{{ item.gender }}</span>
                  <span class="history-disease-card__tag">{{ item.purpose }}</span>
                </div>
                <span class="history-disease-card__card-no">{{ item.cardNo }}</span>
              </div>
            </div>
            <div class="history-disease-card__import"><span>导入</span><PortalRowArrow /></div>
          </div>

          <div class="history-disease-card__divider" />

          <p class="history-disease-card__desc">{{ item.symptomText }}</p>

          <div class="history-disease-card__meta">
            <span>{{ item.time }}</span>
            <span class="doctor-card__type" :class="{ 'is-yizhen': item.serviceType === '在线复诊' }">{{ item.serviceType }}</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { usePageScroll } from '@tarojs/taro'
import { useAppStore } from '@/store'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'
import './history.less'

const IMPORTED_SYMPTOM_KEY = 'online_consult_imported_symptom'
const store = useAppStore()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)

usePageScroll((res) => {
  scrollTop.value = res.scrollTop
})

type HistoryValue = 'unknown' | 'none' | 'yes'

interface HistoryRecord {
  id: string
  patientName: string
  gender: string
  avatar: string
  cardNo: string
  purpose: string
  purposeValue: 'online_revisit' | 'offline' | 'report' | 'chronic'
  serviceType: string
  time: string
  symptomText: string
  allergyText: string
  diseaseText: string
  selectedAllergyTags: string[]
  selectedDiseaseTags: string[]
  diseaseHistory: HistoryValue
  allergyHistory: HistoryValue
}

const maskName = (name: string) => {
  if (!name) return ''
  if (name.length <= 2) return `${name.slice(0, 1)}*`
  return `${name.slice(0, 1)}*${name.slice(-1)}`
}

const currentPatientGender = computed(() => {
  return store.activePatient?.gender === 'male' ? '男' : '女'
})

const maskCardNo = (cardNo: string) => {
  if (!cardNo) return ''
  if (cardNo.length <= 4) return cardNo
  return `${cardNo.slice(0, 2)}****${cardNo.slice(-2)}`
}

const historyRecords = computed<HistoryRecord[]>(() => [
  {
    id: 'his_1',
    patientName: maskName(store.activePatient?.name || '孔晓雯'),
    gender: currentPatientGender.value,
    avatar: store.activePatient?.avatar || store.patients[0]?.avatar,
    cardNo: maskCardNo(store.activePatient?.cardNo || 'AE5829143'),
    purpose: '复诊开药',
    purposeValue: 'online_revisit',
    serviceType: '在线复诊',
    time: '2026-05-28 19:42:16',
    symptomText: '近期肝区偶有不适，伴随乏力，曾检查肝功能指标波动，希望医生结合病史进行复诊评估。',
    allergyText: '',
    diseaseText: '慢性乙型肝炎复诊',
    selectedAllergyTags: [],
    selectedDiseaseTags: ['肝炎'],
    diseaseHistory: 'yes',
    allergyHistory: 'none'
  },
  {
    id: 'his_2',
    patientName: maskName('林小会'),
    gender: '女',
    avatar: store.patients.find(item => item.id === 'p_elderly_female')?.avatar || store.patients[0]?.avatar,
    cardNo: maskCardNo('AL2039149'),
    purpose: '开检查检验',
    purposeValue: 'offline',
    serviceType: '图文问诊',
    time: '2026-05-12 10:20:20',
    symptomText: '心律不齐、睡眠较浅，晚上容易醒，偶尔感觉胸闷，想咨询近期用药是否需要调整。',
    allergyText: '',
    diseaseText: '心律不齐，睡眠障碍',
    selectedAllergyTags: [],
    selectedDiseaseTags: [],
    diseaseHistory: 'yes',
    allergyHistory: 'unknown'
  },
  {
    id: 'his_3',
    patientName: maskName('百里惠之子'),
    gender: '男',
    avatar: store.patients.find(item => item.id === 'p_adult_male')?.avatar || store.patients[0]?.avatar,
    cardNo: maskCardNo('AE1234567'),
    purpose: '报告解读',
    purposeValue: 'report',
    serviceType: '在线复诊',
    time: '2026-04-18 15:36:08',
    symptomText: '体检发现转氨酶轻度升高，近期无明显腹痛，有饮酒史，希望医生解读报告并给出复查建议。',
    allergyText: '',
    diseaseText: '肝功能异常',
    selectedAllergyTags: [],
    selectedDiseaseTags: ['肝炎'],
    diseaseHistory: 'yes',
    allergyHistory: 'none'
  }
])

const importRecord = (item: HistoryRecord) => {
  Taro.setStorageSync(IMPORTED_SYMPTOM_KEY, {
    symptomText: item.symptomText,
    allergyText: item.allergyText,
    diseaseText: item.diseaseText,
    selectedAllergyTags: item.selectedAllergyTags,
    selectedDiseaseTags: item.selectedDiseaseTags,
    diseaseHistory: item.diseaseHistory,
    allergyHistory: item.allergyHistory,
    purpose: item.purposeValue
  })

  Taro.showToast({ title: '已导入病情', icon: 'success', duration: 800 })
  setTimeout(() => {
    Taro.navigateBack({
      delta: 1,
      fail(err) {
        console.error('navigateBack online consult history fail:', err, 'Current depth:', Taro.getCurrentPages().length)
        Taro.redirectTo({
          url: '/pages/common-list/online-followup/index',
          fail(redirectErr) {
            console.error('redirectTo online consult fail:', redirectErr, 'Current depth:', Taro.getCurrentPages().length)
          }
        })
      }
    })
  }, 500)
}
</script>
