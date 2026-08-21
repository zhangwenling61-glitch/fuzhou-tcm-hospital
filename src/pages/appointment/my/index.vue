<template>
  <view
    class="yh-secondary-page appointment-flow-page my-appointment-page"
    :class="{ 'yh-scroll-locked': isPopupOpen }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar title="我的预约" :scroll-top="scrollTop" secondary />

    <view class="appointment-page-header my-appointment-page__header">
      <PortalUserCard
        :key="store.activePatientId"
        kind="clinic"
        :show-todo-bar="false"
        :show-todo-panel="false"
        @primary="showToast('医保码')"
      />
    </view>

    <view class="appointment-content my-appointment-page__content">
      <view class="my-appointment-page__filters">
        <view hover-class="filter-btn--hover" @tap="openFilterPopup('time')"><text>{{ selectedTimeFilter }}</text></view>
        <view hover-class="filter-btn--hover" @tap="openFilterPopup('status')"><text>{{ selectedStatusFilter }}</text></view>
      </view>

      <view class="my-appointment-page__list">
        <view
          v-for="(item, index) in filteredAppointments"
          :key="item.id"
          class="yh-secondary-card my-appointment-page__card"
          :class="{ 'is-disabled': item.status === '已取消' || item.status === '已停诊' }"
          hover-class="my-appointment-page__card--hover"
          :hover-stay-time="150"
          @tap="goAppointmentDetailStatus(item)"
        >
          <view class="my-appointment-page__card-head">
            <view class="my-appointment-page__card-head-left">
              <view class="my-appointment-page__card-head-titles">
                <text class="my-appointment-page__card-type">门诊预约</text>
              </view>
            </view>
            <view
              class="my-appointment-page__status"
              :class="'my-appointment-page__status--' + item.statusType"
              hover-class="my-appointment-page__status--hover"
              @tap.stop="goAppointmentDetailStatus(item)"
            >
              <text>{{ item.status }}</text>
              <view class="my-appointment-page__status-arrow"></view>
            </view>
          </view>

          <view class="my-appointment-page__body">
            <view class="my-appointment-page__core">
              <view
                class="my-appointment-page__core-item"
                :hover-class="item.status === '已取消' || item.status === '已停诊' ? 'none' : 'my-appointment-page__core-item--hover'"
                @tap.stop="goDoctorHome(item)"
              >
                <text class="my-appointment-page__core-label">预约医生</text>
                <view class="my-appointment-page__doctor">
                  <image class="my-appointment-page__doctor-avatar" :src="getDoctorAvatar(item)" mode="aspectFill" />
                  <text class="my-appointment-page__core-value my-appointment-page__doctor-name">{{ item.doctor }}</text>
                </view>
              </view>
              <view
                class="my-appointment-page__core-item"
                :hover-class="item.status === '已取消' || item.status === '已停诊' ? 'none' : 'my-appointment-page__core-item--hover'"
                @tap.stop="goDepartmentDoctors(item)"
              >
                <text class="my-appointment-page__core-label">预约科室</text>
                <text class="my-appointment-page__core-value">{{ item.department }}</text>
              </view>
            </view>

            <view
              class="my-appointment-page__campus"
              :hover-class="item.status === '已取消' || item.status === '已停诊' ? 'none' : 'my-appointment-page__campus--hover'"
              @tap.stop="handleCampusTap(item)"
            >
              <view class="my-appointment-page__campus-main">
                <text class="my-appointment-page__campus-label">预约院区</text>
                <text class="my-appointment-page__campus-value">{{ item.campus }}</text>
              </view>
              <view class="my-appointment-page__link">
                <view class="my-appointment-page__link-icon"></view>
                <text>地址导航</text>
              </view>
            </view>

            <view class="my-appointment-page__rows">
              <view class="appointment-row">
                <text class="appointment-row__label">预约时间</text>
                <text class="appointment-row__value" :class="{ 'appointment-row__value--primary': item.status !== '已取消' && item.status !== '已停诊' }">{{ item.time }}</text>
              </view>
              <view class="appointment-row">
                <text class="appointment-row__label">诊室位置</text>
                <text class="appointment-row__value" :class="{ 'appointment-row__value--primary': item.status !== '已取消' && item.status !== '已停诊' }">{{ item.room }}</text>
              </view>
              <view class="appointment-row">
                <text class="appointment-row__label">预约序号</text>
                <view class="appointment-row__value">
                  <text>{{ item.no }}</text>
                  <text style="margin: 0 16rpx; color: rgba(69, 113, 48, 0.16);">|</text>
                  <text style="color: #657487; margin-right: 8rpx;">就诊人</text>
                  <text style="color: #222222;">{{ item.patient }}</text>
                </view>
              </view>
            </view>

            <view class="my-appointment-page__actions">
              <view
                v-if="item.status !== '已取消' && item.status !== '已停诊'"
                class="my-appointment-page__action my-appointment-page__action--tip"
                hover-class="my-appointment-page__action--tip-hover"
                @tap.stop="handleNoticeClick(item)"
              >
                <image
                  class="my-appointment-page__action-tip-icon"
                  :src="iconBell"
                  mode="aspectFit"
                  :style="{ 'animation-delay': (index * 0.5) + 's', '-webkit-animation-delay': (index * 0.5) + 's' }"
                />
                <text>温馨提示</text>
              </view>
              <view
                v-for="action in getVisibleActions(item)"
                :key="item.id + action"
                class="my-appointment-page__action"
                :class="{
                  'my-appointment-page__action--primary': action === '线上取号' || action === '诊前信息' || action === '诊前信息填写' || action === '诊前信息收集' || action === '诊前信息编辑' || action === '再次预约'
                }"
                hover-class="my-appointment-page__action--hover"
                @tap.stop="handleAction(action, item)"
              >
                <text>{{ action }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="filteredAppointments.length === 0" class="yh-secondary-card empty-card yh-empty-state-screen">
          <PortalEmptyState desc="暂无相关预约记录" />
        </view>
      </view>
    </view>

    <!-- Global Patient Switcher popup -->
    <PortalActionSheet
      :show="store.showPatientSwitcher"
      title="切换就诊人"
      :actions="store.patients.map(p => p.name)"
      :value="store.activePatient.name"
      @update:show="store.showPatientSwitcher = $event"
      @select="handleSelectPatient"
    />

    <!-- Filter sheet popup -->
    <PortalActionSheet
      :show="showFilterPopup"
      :title="filterPopupTitle"
      :actions="filterPopupActions"
      :value="filterPopupValue"
      @update:show="showFilterPopup = $event"
      @select="onFilterSelect"
    />

    <!-- 温馨提示弹窗 -->
    <PortalInspectionNoticePopup
      v-if="showNoticePopup"
      :title="noticeTitle"
      :items="noticeItems"
      @confirm="showNoticePopup = false"
    />

    <!-- 取消预约弹窗 -->
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
import { computed, ref } from 'vue'
import Taro, { useDidShow, usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalUserCard from '@/components/PortalUserCard/index.vue'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import PortalInspectionNoticePopup from '@/components/PortalInspectionNoticePopup/index.vue'
import PortalEmptyState from '@/components/PortalEmptyState/index.vue'
import PortalGeneralDialog from '@/components/PortalGeneralDialog/index.vue'
import { useAppStore } from '@/store'
import { getRouteUrl, getSafeMenuButtonBoundingClientRect } from '@/utils'
import { doctors, myAppointments, routeMap } from '../mock'
import { AVATAR_MAP } from '@/utils/avatar'
import iconBell from '@/assets/icons/nav/bell-green.svg'
import '../common.less'
import './index.less'

const store = useAppStore()
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

const showNoticePopup = ref(false)
const noticeTitle = ref('')
const noticeItems = ref<string[]>([])

const showFilterPopup = ref(false)
const filterPopupTitle = ref('')
const filterPopupActions = ref<string[]>([])
const filterPopupValue = ref('')
const currentFilterType = ref<'time' | 'status'>('time')
const selectedTimeFilter = ref('近三个月')
const selectedStatusFilter = ref('全部状态')

const localAppointmentsList = ref<any[]>([])

useDidShow(() => {
  store.initAppointments(myAppointments)
  localAppointmentsList.value = [...store.appointmentsList]
})

usePageScroll(res => {
  scrollTop.value = res.scrollTop || 0
})

const showCancelDialog = ref(false)
const pendingCancelItem = ref<any>(null)

const isPopupOpen = computed(() => {
  return store.showPatientSwitcher || showFilterPopup.value || showNoticePopup.value || showCancelDialog.value
})

function openFilterPopup(type: 'time' | 'status') {
  currentFilterType.value = type
  if (type === 'time') {
    filterPopupTitle.value = '选择时间范围'
    filterPopupActions.value = ['近三个月', '近半年', '今年内', '全部预约']
    filterPopupValue.value = selectedTimeFilter.value
  } else {
    filterPopupTitle.value = '选择就诊状态'
    filterPopupActions.value = ['全部状态', '待就诊', '待签到', '已就诊', '已取消', '已停诊']
    filterPopupValue.value = selectedStatusFilter.value
  }
  showFilterPopup.value = true
}

function onFilterSelect(val: string) {
  if (currentFilterType.value === 'time') {
    selectedTimeFilter.value = val
  } else {
    selectedStatusFilter.value = val
  }
  showFilterPopup.value = false
}

const filteredAppointments = computed(() => {
  let list = localAppointmentsList.value

  if (selectedStatusFilter.value !== '全部状态') {
    list = list.filter(item => item.status === selectedStatusFilter.value)
  }

  return list
})

function handleNoticeClick(item: typeof myAppointments[number]) {
  if (item.status === '待签到') {
    noticeTitle.value = '就诊签到须知'
    noticeItems.value = [
      '1. 请于就诊时间前<strong>15分钟</strong>到达对应诊室进行自助签到。',
      '2. 签到成功后，请在诊区候诊椅耐心等待呼号就诊。',
      '3. 如错过呼号，系统将自动顺延<strong>3个号位</strong>，请及时联系诊区护士站处理。',
      '4. 医保结算及现场取号流程以现场实际规则为准，如有疑问可前往导诊台咨询。'
    ]
  } else if (item.status === '待就诊') {
    noticeTitle.value = '就诊服务须知'
    noticeItems.value = [
      '1. 您的预约状态为<strong>待就诊</strong>，请准时前往对应院区及诊室候诊。',
      '2. 为保障您的就医体验，建议在就诊前半小时内完成现场签到或线上签到。',
      '3. 如需取消预约，请在就诊前通过“我的预约”详情页提前办理取消，以免产生违约记录。',
      '4. 就诊期间请携带好您的身份证或医保电子凭证，以便医生核验并开具处方。'
    ]
  } else {
    noticeTitle.value = '诊后服务指南'
    noticeItems.value = [
      '1. 您的就诊已顺利完成。可在首页或报告查询入口查看本次就诊的相关检验检查报告。',
      '2. 如医生开具了处方，请在<strong>24小时内</strong>完成线上缴费并前往药房取药。',
      '3. 诊后如需复诊，可点击下方“<strong>再次预约</strong>”或选择“<strong>在线复诊</strong>”进行线上图文咨询。',
      '4. 对本次就医服务有任何意见 or 建议，欢迎前往满意度评价页面进行反馈。'
    ]
  }
  showNoticePopup.value = true
}

function showToast(title: string) {
  Taro.showToast({
    title,
    icon: 'none'
  })
}

function logNavigateFail(route: string, err: unknown) {
  const pages = getCurrentPages()
  console.error('navigateTo failed:', route, err, 'pages:', pages.length, pages.map(p => p.route))
}

function navigateToRoute(route: string) {
  Taro.navigateTo({
    url: getRouteUrl(route),
    fail: err => logNavigateFail(route, err)
  })
}

function getDoctorAvatar(item: typeof myAppointments[number]) {
  if (item.doctorAvatar) {
    return item.doctorAvatar
  }

  const matchedDoctor = doctors.find(doctor => {
    return doctor.id === item.doctorId || doctor.name === item.doctor
  })

  if (matchedDoctor?.avatar) {
    return matchedDoctor.avatar
  }

  return AVATAR_MAP.doctorMale
}

function goDoctorHome(item: typeof myAppointments[number]) {
  const query = [
    `doctorId=${encodeURIComponent(item.doctorId || 'song-yuanlin')}`,
    item.campusId ? `campusId=${encodeURIComponent(item.campusId)}` : '',
    item.departmentId ? `departmentId=${encodeURIComponent(item.departmentId)}` : '',
    item.department ? `deptName=${encodeURIComponent(item.department)}` : ''
  ].filter(Boolean).join('&')

  navigateToRoute(`${routeMap.detail}?${query}`)
}

function goDepartmentDoctors(item: typeof myAppointments[number]) {
  const query = [
    item.department ? `department=${encodeURIComponent(item.department)}` : '',
    item.departmentId ? `departmentId=${encodeURIComponent(item.departmentId)}` : '',
    item.campusId ? `campusId=${encodeURIComponent(item.campusId)}` : ''
  ].filter(Boolean).join('&')

  navigateToRoute(query ? `${routeMap.doctor}?${query}` : routeMap.doctor)
}

function getVisibleActions(item: typeof myAppointments[number]) {
  return item.actions.filter(action => action !== '温馨提示').map(action => {
    if (action === '诊前信息收集') {
      return '诊前信息填写'
    }
    return action
  })
}

function handleCampusTap(item: typeof myAppointments[number]) {
  const isXihong = String(item.campus).includes('西洪')
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
      showToast('打开地图失败')
    }
  })
}

function handleAction(action: string, item: any) {
  if (action === '再次预约') {
    const query = [
      `doctorId=${encodeURIComponent(item.doctorId || 'song-yuanlin')}`,
      item.campusId ? `campusId=${encodeURIComponent(item.campusId)}` : '',
      item.departmentId ? `departmentId=${encodeURIComponent(item.departmentId)}` : ''
    ].filter(Boolean).join('&')
    navigateToRoute(`${routeMap.detail}?${query}`)
    return
  }

  if (action === '线上取号') {
    navigateToRoute('/pages/common-list/appointment-signin/index')
    return
  }

  if (action === '取消预约') {
    pendingCancelItem.value = item
    showCancelDialog.value = true
    return
  }

  if (action === '诊前信息收集' || action === '诊前信息编辑' || action === '诊前信息' || action === '诊前信息填写') {
    navigateToRoute(`/pages/common-list/pre-fill/index?id=${item.id}&doctor=${encodeURIComponent(item.doctor)}&dept=${encodeURIComponent(item.department)}`)
    return
  }

  showToast(action)
}

function goAppointmentDetailStatus(item: any) {
  navigateToRoute(`/pages/appointment/detail-status/index?id=${item.id}`)
}

function confirmCancel() {
  if (pendingCancelItem.value) {
    store.cancelAppointment(pendingCancelItem.value.id)
    localAppointmentsList.value = [...store.appointmentsList]
    Taro.showToast({
      title: '预约已取消',
      icon: 'success'
    })
  }
  showCancelDialog.value = false
  pendingCancelItem.value = null
}
</script>
