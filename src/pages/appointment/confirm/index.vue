<template>
  <view
    class="yh-secondary-page appointment-flow-page confirm-page"
    :class="{ 'yh-scroll-locked': showNoticeDialog || showConfirmDialog }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="预约信息" :scroll-top="scrollTop" secondary />

    <view class="appointment-content confirm-page__content">
      <view class="appointment-card appointment-tip-card confirm-page__tip">
        <text class="appointment-tip-card__title">温馨提示</text>
        <text v-for="item in noticeItems" :key="item" class="appointment-tip-card__item">· {{ item }}</text>
      </view>

      <view class="appointment-card confirm-page__doctor-card">
        <view class="appointment-doctor">
          <view class="appointment-doctor__avatar">
            <image :src="doctor.avatar" mode="aspectFill" />
          </view>
          <view class="appointment-doctor__info">
            <view class="appointment-doctor__name-line">
              <text class="appointment-doctor__name">{{ doctor.name }}</text>
              <view class="appointment-doctor__tag"><text>{{ doctor.title }}</text></view>
            </view>
            <text class="appointment-doctor__dept">{{ doctor.department }}</text>
          </view>
        </view>
      </view>

      <view class="appointment-card confirm-page__form-card">
        <view
          v-for="row in appointmentRows"
          :key="row.label"
          class="appointment-row"
        >
          <text class="appointment-row__label">{{ row.label }}</text>
          <view class="appointment-row__value" :class="{ 'appointment-row__value--primary': row.primary }">
            <text>{{ row.value }}</text>
            <view v-if="row.label === '就诊院区'" class="appointment-row__nav-btn" @tap.stop="openMapNavigation">
              <span class="appointment-row__nav-icon"></span>
            </view>
          </view>
        </view>
      </view>

      <view
        class="appointment-card confirm-page__form-card"
        :class="{ 'is-focused': phoneFocused }"
      >
        <view
          class="appointment-row"
          hover-class="confirm-page__row-hover"
          :hover-stay-time="150"
          @tap="store.showPatientSwitcher = true"
        >
          <text class="appointment-row__label">就诊人</text>
          <view class="appointment-row__value">
            <text>{{ maskName(activePatient.name) }}({{ formatCardNo(activePatient.cardNo) }})</text>
            <PortalRowArrow />
          </view>
        </view>

        <view class="appointment-row confirm-page__phone-row">
          <text class="appointment-row__label">手机号</text>
          <view class="appointment-row__value confirm-page__phone-value">
            <input
              class="confirm-page__phone-input"
              :class="{ 'confirm-page__phone-input--error': phoneHasError }"
              type="number"
              maxlength="11"
              v-model="phone"
              placeholder="请输入手机号"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
            />
          </view>
        </view>
      </view>

      <view class="confirm-page__agree">
        <button
          class="confirm-page__agree-btn"
          type="button"
          @tap="agreed = !agreed"
        >
          <img
            class="confirm-page__agree-icon"
            :src="agreed ? iconCheckSquare : iconSquare"
            alt=""
          />
        </button>
        <text @tap="agreed = !agreed">已阅读并同意</text>
        <text @tap.stop="showNoticeDialog = true">《预约挂号须知》</text>
      </view>
    </view>

    <view class="appointment-fixed-bar confirm-page__fixed">
      <view class="appointment-primary-btn" @tap="handleConfirmSubmit">
        <text>确认预约</text>
      </view>
    </view>

    <!-- Global Patient Switcher popup placed at page root level -->
    <PortalActionSheet
      :show="store.showPatientSwitcher"
      title="切换就诊人"
      :actions="store.patients.map(p => p.name)"
      :value="store.activePatient.name"
      @update:show="store.showPatientSwitcher = $event"
      @select="handleSelectPatient"
    />
    <PortalInspectionNoticePopup
      v-if="showNoticeDialog"
      :title="dialogTitle"
      :items="dialogMessage"
      @confirm="showNoticeDialog = false"
    />
    <PortalGeneralDialog
      v-if="showConfirmDialog"
      title="温馨提示"
      message="点击按键即代表同意协议"
      confirm-text="同意"
      cancel-text="取消"
      :show-cancel="true"
      @confirm="handleDialogAgree"
      @cancel="showConfirmDialog = false"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Taro, { useLoad, usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import PortalInspectionNoticePopup from '@/components/PortalInspectionNoticePopup/index.vue'
import PortalGeneralDialog from '@/components/PortalGeneralDialog/index.vue'
import { useAppStore } from '@/store'
import { getRouteUrl, getSafeMenuButtonBoundingClientRect, maskName } from '@/utils'
import {
  doctors,
  noticeItems,
  routeMap,
  getDoctorById,
  getDoctorDepartments as getDoctorDeptSchedule,
  generateDynamicTimeSlots,
  myAppointments
} from '../mock'
import iconSquare from '@/assets/icons/record/square.svg'
import iconCheckSquare from '@/assets/icons/record/check-square.svg'
import '../common.less'
import './index.less'

const store = useAppStore()
const activePatient = computed(() => store.activePatient)

const formatCardNo = (card: string) => {
  if (!card) return ''
  if (card.length === 9) {
    return card.slice(0, 2) + '*****' + card.slice(-2)
  }
  return card.slice(0, 3) + '******' + card.slice(-3)
}
const handleSelectPatient = (name: string) => {
  const target = store.patients.find(p => p.name === name)
  if (target) {
    store.switchPatient(target.id)
  }
  store.showPatientSwitcher = false
}
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)
const agreed = ref(false)

const doctorId = ref('')
const campus = ref('')
const slotId = ref('')
const timeId = ref('')
const customDeptName = ref('')
const baseDoctor = ref<any>(doctors[0] || {})

const doctor = computed(() => {
  const doc = baseDoctor.value || {}
  const deptName = customDeptName.value || doc.department || doc.clinic || '非病毒性肝病科'
  return {
    ...doc,
    department: deptName,
    clinic: deptName
  }
})

const phone = ref('13556667892')
const phoneFocused = ref(false)
const phoneHasError = ref(false)

// Sync phone number automatically when switching patient
watch(activePatient, (newPatient) => {
  if (newPatient) {
    if (newPatient.name === '孔晓雯') phone.value = '13556667892'
    else if (newPatient.name === '许小凯') phone.value = '13812345678'
    else if (newPatient.name === '孔小航') phone.value = '13987654321'
    else if (newPatient.name === '孔小璇') phone.value = '13600001111'
    else if (newPatient.name === '孔德华') phone.value = '13311112222'
    else if (newPatient.name === '叶淑文') phone.value = '18988889999'
  }
}, { immediate: true })
const showNoticeDialog = ref(false)
const dialogTitle = ref('预约挂号须知')
const dialogMessage = ref([
  '一、根据相关法律法规要求，挂号就诊需实行<strong>实名制预约</strong>。请您准确填写并核对就诊人身份信息（姓名、身份证号、就医凭证及有效手机号码）。',
  '二、为保障临床诊疗秩序，每日预约挂号均设有<strong>时段限额限制</strong>。请在选中时段前<strong>至少15分钟</strong>到达对应诊区签到，逾期未签到将视为自动放弃该号源。',
  '三、如您因故无法按时就诊，请务必于就诊日前一天<strong>18:00之前</strong>通过本平台办理线上取消预约退费。逾期未取消或未按时就诊者，将按<strong>爽约处理</strong>。',
  '四、累计爽约达<strong>3次及以上</strong>的就诊人，系统将自动列入预约黑名单，自最后一次爽约起<strong>30天内</strong>限制其使用线上挂号服务，仅能通过线下窗口进行挂号。',
  '五、线上收取的诊查费用将全额汇入医院官方账户，开票事宜均由医院窗口提供支持。如遇不可抗力或<strong>医师紧急停诊</strong>，系统将自动发起退款并发送短信提醒。'
])

const showConfirmDialog = ref(false)

useLoad((query) => {
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
  if (query.slotId) {
    try {
      slotId.value = decodeURIComponent(query.slotId)
    } catch (e) {
      slotId.value = query.slotId
    }
  }
  if (query.timeId) {
    try {
      timeId.value = decodeURIComponent(query.timeId)
    } catch (e) {
      timeId.value = query.timeId
    }
  }
})

const appointmentRows = computed(() => {
  let slotTime = '2026/05/27 08:30'
  const doc = doctor.value

  if (slotId.value) {
    const depts = getDoctorDeptSchedule(doc, campus.value || doc.campus)
    let foundSlot: any = null
    for (const dept of depts) {
      for (const group of dept.schedule) {
        const match = group.items.find((item: any) => item.id === slotId.value)
        if (match) {
          foundSlot = match
          break
        }
      }
      if (foundSlot) break
    }

    if (foundSlot) {
      slotTime = foundSlot.time
      if (timeId.value) {
        const isXihong = campus.value === '西洪院区'
        const deptSeed = slotId.value.includes('conditioning') ? 'conditioning' : (slotId.value.includes('rehab') ? 'rehab' : 'classic')
        const tSlots = generateDynamicTimeSlots(slotId.value, isXihong, deptSeed)
        const tSlot = tSlots.find((item: any) => item.id === timeId.value)
        if (tSlot) {
          slotTime = `${foundSlot.time.split(' ')[0]} ${tSlot.time}`
        }
      }
    }
  }

  return [
    { label: '就诊院区', value: `${campus.value || doc.campus}` },
    { label: '就诊时间', value: slotTime },
    { label: '诊查费', value: doc.consultPrice, primary: true }
  ]
})

const openMapNavigation = () => {
  const isXihong = String(campus.value || doctor.value.campus).includes('西洪')
  const name = isXihong ? '福州市第一总医院-西洪院区' : '福州市第一总医院-金山院区'
  const address = isXihong ? '福州市鼓楼区西洪路243号' : '福州市仓山区金祥路507号'
  const latitude = isXihong ? 26.09012 : 26.027011
  const longitude = isXihong ? 119.28292 : 119.227415

  Taro.openLocation({
    latitude,
    longitude,
    name,
    address,
    scale: 18,
    fail(err) {
      console.error('openLocation failed:', err)
      Taro.showToast({
        title: '打开地图失败',
        icon: 'none'
      })
    }
  })
}

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

function handleConfirmSubmit() {
  const cleanedPhone = String(phone.value || '').trim()
  if (cleanedPhone.length !== 11 || !/^1\d{10}$/.test(cleanedPhone)) {
    phoneHasError.value = true
    Taro.showToast({
      title: '手机号码格式有误',
      icon: 'none'
    })
    return
  }

  if (!agreed.value) {
    showConfirmDialog.value = true
    return
  }
  goResult()
}

function handleDialogAgree() {
  agreed.value = true
  showConfirmDialog.value = false
  goResult()
}

watch(phone, (newVal) => {
  const cleaned = String(newVal || '').trim()
  if (cleaned.length === 11 && /^1\d{10}$/.test(cleaned)) {
    phoneHasError.value = false
  }
})

function goResult() {
  let slotTime = '2026/05/27 08:30'
  const doc = doctor.value

  if (slotId.value) {
    const depts = getDoctorDeptSchedule(doc, campus.value || doc.campus)
    let foundSlot: any = null
    for (const dept of depts) {
      for (const group of dept.schedule) {
        const match = group.items.find((item: any) => item.id === slotId.value)
        if (match) {
          foundSlot = match
          break
        }
      }
      if (foundSlot) break
    }

    if (foundSlot) {
      slotTime = foundSlot.time
      if (timeId.value) {
        const isXihong = campus.value === '西洪院区'
        const deptSeed = slotId.value.includes('conditioning') ? 'conditioning' : (slotId.value.includes('rehab') ? 'rehab' : 'classic')
        const tSlots = generateDynamicTimeSlots(slotId.value, isXihong, deptSeed)
        const tSlot = tSlots.find((item: any) => item.id === timeId.value)
        if (tSlot) {
          slotTime = `${foundSlot.time.split(' ')[0]} ${tSlot.time}`
        }
      }
    }
  }

  const newAppointment = {
    id: `app_${Date.now()}`,
    status: '待就诊',
    statusType: 'success',
    department: doc.department || doc.clinic || '非病毒性肝病科',
    doctor: doc.name,
    doctorAvatar: doc.avatar,
    doctorId: doc.id,
    time: slotTime,
    no: '12号',
    campus: campus.value || doc.campus,
    room: doc.clinic === '重症肝病科' ? '门诊楼二楼 218诊室' : (doc.clinic === '皮肤病普通门诊' ? '门诊楼三楼 302诊室' : '门诊楼四楼 406诊室'),
    patient: activePatient.value.name,
    actions: ['温馨提示', '取消预约', '诊前信息收集']
  }

  store.addAppointment(newAppointment, myAppointments)

  const query = [
    'status=success',
    `doctorId=${encodeURIComponent(doc.id)}`,
    `campus=${encodeURIComponent(campus.value || doc.campus)}`,
    `slotTime=${encodeURIComponent(slotTime)}`,
    `deptName=${encodeURIComponent(doc.department)}`
  ].join('&')

  Taro.redirectTo({ url: getRouteUrl(`${routeMap.result}?${query}`) })
}
</script>
