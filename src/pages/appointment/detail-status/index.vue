<template>
  <view
    class="yh-secondary-page appointment-detail-status-page"
    :class="{ 'yh-scroll-locked': showCancelDialog }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="预约详情" :scroll-top="scrollTop" secondary />

    <view class="detail-status-content confirm-page__content">
      <!-- 医生头部卡片 -->
      <view class="appointment-card confirm-page__doctor-card">
        <view class="appointment-doctor">
          <view class="appointment-doctor__avatar">
            <image :src="appointment.doctorAvatar || defaultAvatar" mode="aspectFill" />
          </view>
          <view class="appointment-doctor__info">
            <view class="appointment-doctor__name-line">
              <text class="appointment-doctor__name">{{ appointment.doctor }}</text>
              <view class="appointment-doctor__tag"><text>{{ getDoctorTitle(appointment.doctor) }}</text></view>
            </view>
            <text class="appointment-doctor__dept">{{ appointment.department }}</text>
          </view>
        </view>
      </view>

      <!-- 详情列表卡片 1 -->
      <view class="appointment-card confirm-page__form-card">
        <view class="appointment-row">
          <text class="appointment-row__label">就诊院区</text>
          <view class="appointment-row__value">
            <text>{{ appointment.campus }}</text>
            <view class="appointment-row__nav-btn" @tap.stop="openMapNavigation">
              <span class="appointment-row__nav-icon"></span>
            </view>
          </view>
        </view>
        <view class="appointment-row">
          <text class="appointment-row__label">就诊科室</text>
          <view class="appointment-row__value">
            <text>{{ appointment.department }}</text>
          </view>
        </view>
        <view class="appointment-row">
          <text class="appointment-row__label">就诊时间</text>
          <view class="appointment-row__value">
            <text>{{ appointment.time }}</text>
          </view>
        </view>
        <view class="appointment-row">
          <text class="appointment-row__label">就诊状态</text>
          <view
            class="appointment-row__value"
            :class="'status-text--' + (appointment.statusType || 'default')"
          >
            <text>{{ appointment.status }}</text>
          </view>
        </view>
        <!-- 诊查费 -->
        <view v-if="getDoctorPrice(appointment.doctor)" class="appointment-row">
          <text class="appointment-row__label">诊查费</text>
          <view class="appointment-row__value appointment-row__value--primary">
            <text>{{ getDoctorPrice(appointment.doctor) }}</text>
          </view>
        </view>
      </view>

      <!-- 详情列表卡片 2 -->
      <view class="appointment-card confirm-page__form-card">
        <view class="appointment-row">
          <text class="appointment-row__label">就诊人</text>
          <view class="appointment-row__value">
            <text>{{ patientDisplayName }}</text>
          </view>
        </view>
        <view class="appointment-row">
          <text class="appointment-row__label">手机号</text>
          <view class="appointment-row__value">
            <text>{{ phone }}</text>
          </view>
        </view>
      </view>

      <!-- 注意事项卡片 -->
      <view class="appointment-card notes-card">
        <view class="notes-card__header">
          <text class="notes-card__title">注意事项</text>
        </view>
        <view class="notes-card__body">
          <view class="notes-item">
            <text class="notes-item__num">1、</text>
            <rich-text class="notes-item__text" nodes="<strong>签到取号：</strong>请就诊当日到院签到，支持微信签到、自助机、服务台签到取号，可提前30分钟或延迟30分钟（超过30分钟则预约无效，需要重新排号）；" />
          </view>
          <view class="notes-item">
            <text class="notes-item__num">2、</text>
            <rich-text class="notes-item__text" nodes="<strong>退号：</strong>如您无法按时就诊，请于就诊前一天晚上取消，否则计爽约1次，一个月内爽约&ge;3次，将被限制线上预约，请到院解除限制或等待30天后自动解除。" />
          </view>
          <view class="notes-item">
            <text class="notes-item__num">3、</text>
            <rich-text class="notes-item__text" nodes="<strong>首次就诊患者：</strong>需要带身份证原件办理开卡；未实名制的复诊患者：在就诊前需要持本人有效身份证件进行实名认证，否则无法就诊；有效证件类型包括：身份证、社保卡、户口（仅限未成年）、护照、驾驶证、港澳台通行证、老人证、军官证、出生证（仅限新生儿）。" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部悬浮按钮区 -->
    <view
      v-if="appointment.status === '待就诊' || appointment.status === '待签到'"
      class="fixed-bottom-bar is-transparent"
    >
      <view
        class="fixed-bottom-bar__btn is-cancel"
        hover-class="fixed-bottom-bar__btn--cancel-hover"
        @tap="handleCancelClick"
      >
        <text>取消预约</text>
      </view>
      <view
        class="fixed-bottom-bar__btn is-confirm"
        hover-class="fixed-bottom-bar__btn--confirm-hover"
        @tap="goPrefill"
      >
        <text>{{ prefillButtonText }}</text>
      </view>
    </view>
    <view
      v-else-if="appointment.status === '已停诊' || appointment.status === '已取消' || appointment.status === '已就诊'"
      class="fixed-bottom-bar is-transparent"
    >
      <view
        class="fixed-bottom-bar__btn is-confirm"
        hover-class="fixed-bottom-bar__btn--confirm-hover"
        @tap="goRebook"
      >
        <text>再次预约</text>
      </view>
    </view>

    <!-- 取消预约确认弹窗 -->
    <PortalGeneralDialog
      v-if="showCancelDialog"
      title="确认取消预约"
      message="确定要取消本次预约吗？"
      :show-cancel="true"
      confirm-text="确定"
      cancel-text="取消"
      @confirm="confirmCancel"
      @cancel="showCancelDialog = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro, { useLoad, usePageScroll, useDidShow } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalGeneralDialog from '@/components/PortalGeneralDialog/index.vue'
import { useAppStore } from '@/store'
import { getSafeMenuButtonBoundingClientRect, maskName } from '@/utils'
import { myAppointments, doctors } from '../mock'
import '../common.less'
import './index.less'

const store = useAppStore()
const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16
const scrollTop = ref(0)

const appointmentId = ref('')
const localAppointmentsList = ref<any[]>([])

useLoad((query) => {
  if (query.id) {
    appointmentId.value = query.id
  }
})

useDidShow(() => {
  localAppointmentsList.value = [...store.appointmentsList]
})

const appointment = computed(() => {
  return localAppointmentsList.value.find(item => item.id === appointmentId.value) ||
         store.appointmentsList.find(item => item.id === appointmentId.value) ||
         myAppointments[0]
})

const getPatientDetail = (maskedName: string) => {
  if (!maskedName) return null
  const cleanMasked = maskedName.split(' ')[0]
  return store.patients.find(p => {
    const pName = p.name
    if (pName.length !== cleanMasked.length) return false
    return pName[0] === cleanMasked[0] && pName[pName.length - 1] === cleanMasked[cleanMasked.length - 1]
  })
}

const formatCardNo = (card: string) => {
  if (!card) return ''
  if (card.length === 9) {
    return card.slice(0, 2) + '*****' + card.slice(-2)
  }
  return card.slice(0, 3) + '******' + card.slice(-3)
}

const patientDisplayName = computed(() => {
  const name = appointment.value.patient
  if (!name) return ''
  if (name.includes('(')) return name
  const patient = getPatientDetail(name)
  if (patient) {
    return `${maskName(patient.name)}(${formatCardNo(patient.cardNo)})`
  }
  return maskName(name)
})

const phone = computed(() => {
  const patient = getPatientDetail(appointment.value.patient)
  const rawPhone = patient ? (patient.name === '孔晓雯' ? '13556667892' : '13812345678') : '13556667892'
  return rawPhone.slice(0, 3) + '******' + rawPhone.slice(-2)
})

const prefillButtonText = computed(() => {
  return '诊前信息填写'
})

const showCancelDialog = ref(false)

function handleCancelClick() {
  showCancelDialog.value = true
}

function confirmCancel() {
  store.cancelAppointment(appointment.value.id)
  localAppointmentsList.value = [...store.appointmentsList]
  Taro.showToast({
    title: '预约已取消',
    icon: 'success'
  })
  showCancelDialog.value = false
}

function goPrefill() {
  Taro.navigateTo({
    url: `/pages/common-list/pre-fill/index?id=${appointment.value.id}&doctor=${encodeURIComponent(appointment.value.doctor)}&dept=${encodeURIComponent(appointment.value.department)}`
  })
}

function goRebook() {
  const query = [
    `doctorId=${encodeURIComponent(appointment.value.doctorId || 'song-yuanlin')}`,
    appointment.value.campusId ? `campusId=${encodeURIComponent(appointment.value.campusId)}` : '',
    appointment.value.departmentId ? `departmentId=${encodeURIComponent(appointment.value.departmentId)}` : ''
  ].filter(Boolean).join('&')

  Taro.navigateTo({
    url: `/pages/appointment/detail/index?${query}`
  })
}

function getDoctorTitle(name: string) {
  if (name === '张丽华' || name === '徐悦欣' || name === '张丽华') return '主任医师'
  if (name === '叶新彪' || name === '宋元林') return '副主任医师'
  return '医师'
}

function getDoctorPrice(doctorName: string) {
  const doc = doctors.find(d => d.name === doctorName)
  return doc ? doc.consultPrice : '50元'
}

function openMapNavigation() {
  const isXihong = String(appointment.value.campus).includes('西洪')
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

const defaultAvatar = 'https://foruda.gitee.com/images/1779939037698922393/695edf87_16918445.png'

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})
</script>
