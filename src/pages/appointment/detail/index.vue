<template>
  <view
    class="yh-secondary-page appointment-flow-page doctor-home-page"
    :class="{ 'yh-scroll-locked': showConsultDeptPopup || showIntroDialog }"
    :style="{ paddingTop: contentTop + 'px' }"
  >
    <PortalNavBar
      title="医生主页"
      :scroll-top="scrollTop"
      secondary
    />

    <view class="doctor-home-page__header">
      <view class="doctor-home-page__profile doctor-card yh-secondary-card">
        <view class="doctor-card__header">
          <image class="doctor-card__avatar" :src="doctor.avatar" :alt="doctor.name" mode="aspectFill" />
          <view class="doctor-card__info">
            <view class="doctor-card__name-row">
              <text class="doctor-card__name">{{ doctor.name }}</text>
              <text class="doctor-card__divider">|</text>
              <view class="doctor-card__dept-follow">
                <text class="doctor-card__dept">{{ doctor.department }}</text>
                <view
                  class="doctor-card__follow-btn"
                  :class="{ 'is-active': isDoctorFollowed(doctor.id) }"
                  @tap.stop="toggleFollow(doctor.id)"
                >
                  <view v-if="!isDoctorFollowed(doctor.id)" class="doctor-card__follow-plus" />
                  <text>{{ isDoctorFollowed(doctor.id) ? '已关注' : '关注' }}</text>
                </view>
              </view>
            </view>
            <view class="doctor-card__tags-row">
              <text class="doctor-card__rank">{{ doctor.title }}</text>
              <text
                v-for="tag in serviceTags"
                :key="tag"
                class="doctor-card__type"
                :class="{ 'is-purple': tag === '视频问诊', 'is-cyan': tag === '义诊咨询' }"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>

        <!-- Statistics Row -->
        <view class="doctor-card__stats-row">
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_follow.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">问诊量</text>
            <text class="doctor-card__stat-val">{{ doctor.visits }}</text>
          </view>
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_score.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">评分</text>
            <text class="doctor-card__stat-val">99</text>
          </view>
          <view class="doctor-card__stat-item">
            <image class="doctor-card__stat-icon-img" src="https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/%E9%97%A8%E6%88%B7%E9%A6%96%E9%A1%B5/%E6%9C%AA%E5%91%BD%E5%90%8D%E6%96%87%E4%BB%B6%E5%A4%B9/stat_volume.png" mode="aspectFit" />
            <text class="doctor-card__stat-label">关注</text>
            <text class="doctor-card__stat-val">{{ doctor.follows }}</text>
          </view>
        </view>

        <view class="doctor-card__message">
          <view v-if="(doctor.goodAt || '').length + 2 > 50" class="doctor-card__desc-float-spacer" />
          <text v-if="(doctor.goodAt || '').length + 2 > 50" class="doctor-card__desc-detail-btn" @tap.stop="showDoctorIntro(doctor)">详情</text>
          <view class="doctor-card__desc-content">
            <text class="portal-home__expert-desc-label">擅长</text>
            <text class="doctor-card__desc-text">{{ doctor.goodAt }}</text>
          </view>
        </view>
      </view>

      <view
        class="doctor-home-page__ai-card"
        hover-class="doctor-home-page__ai-card--hover"
        :hover-stay-time="150"
        @tap="showFeatureNotAvailable"
      >
        <view class="doctor-home-page__ai-icon">
          <image :src="aiAvatarIcon" mode="aspectFit" />
        </view>
        <view class="doctor-home-page__ai-text">
          <text>该医生已开通</text>
          <text>AI分身</text>
          <text>，随时回答健康问题</text>
        </view>
        <PortalRowArrow />
      </view>

      <view class="doctor-home-page__nav-tabs">
        <button
          class="doctor-home-page__nav-tab"
          :class="{ 'doctor-home-page__nav-tab--active': activeMode === 'register' }"
          type="button"
          @tap="activeMode = 'register'"
        >
          <span>预约挂号</span>
          <div class="doctor-home-page__nav-tab-mark yh-portal-title-mark"></div>
        </button>
        <button
          class="doctor-home-page__nav-tab"
          :class="{ 'doctor-home-page__nav-tab--active': activeMode === 'consult' }"
          type="button"
          @tap="activeMode = 'consult'"
        >
          <span>线上问诊</span>
          <div class="doctor-home-page__nav-tab-mark yh-portal-title-mark"></div>
        </button>
      </view>

      <view v-if="activeMode === 'register'" class="doctor-home-page__date-tabs-wrap">
        <view class="doctor-home-page__date-tabs">
          <view
            v-for="item in displayedDateTabs"
            :key="item.id"
            class="doctor-home-page__date-tab"
            :class="{ 'doctor-home-page__date-tab--active': item.id === selectedDateId }"
            @tap="selectDate(item.id)"
          >
            <text class="doctor-home-page__date-week">{{ item.week }}</text>
            <text class="doctor-home-page__date-value">{{ item.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <view
      class="doctor-home-page__main"
      :class="{ 'doctor-home-page__main--consult': activeMode === 'consult' }"
    >

      <template v-if="activeMode === 'register'">
        <view class="doctor-home-page__schedule-panel">
          <view
            class="doctor-home-page__dept-card"
            :class="{ 'is-active-card': isPrimaryCardActive }"
          >
            <view class="doctor-home-page__dept-head">
              <text>{{ doctor.clinic }}</text>
              <view class="doctor-home-page__dept-meta">
                <view>
                  <text>诊查费</text>
                  <text>{{ doctor.consultPrice }}</text>
                </view>
              </view>
            </view>

            <view
              class="doctor-home-page__collapsible-body doctor-home-page__collapsible-body--expanded"
            >
              <view class="doctor-home-page__dept-slots">
                <view
                  v-for="slot in departmentSlots"
                  :key="slot.id"
                  class="doctor-home-page__dept-slot"
                  :class="{
                    'doctor-home-page__dept-slot--active': isSlotActive(slot.id),
                    'doctor-home-page__dept-slot--disabled': slot.full
                  }"
                  :hover-class="slot.full ? 'none' : 'doctor-home-page__dept-slot--hover'"
                  :hover-stay-time="150"
                  @tap="selectSlot(slot.id)"
                >
                  <text class="dept-slot-label">{{ formatSlotLabel(slot) }}</text>
                </view>
              </view>
            </view>
          </view>

          <view
            class="doctor-home-page__collapsible-body"
            :class="{ 'doctor-home-page__collapsible-body--expanded': shouldShowTimeSlotsForDept('classic') }"
          >
            <view class="doctor-home-page__time-slots">
              <view
                v-for="slot in timeSlots"
                :key="slot.id"
                class="doctor-home-page__time-slot"
                :class="{
                  'doctor-home-page__time-slot--active': isTimeActive(slot.id),
                  'doctor-home-page__time-slot--disabled': slot.booked
                }"
                :hover-class="slot.booked ? 'none' : 'doctor-home-page__time-slot--hover'"
                :hover-stay-time="150"
                @tap="slot.booked ? handleBookedSlotClick() : (activeTimeId = slot.id)"
              >
                <text class="time-slot-no">{{ slot.no }}</text>
                <text class="time-slot-time">{{ slot.time }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="hasScheduleSwitch" class="doctor-home-page__switch-card" @tap="toggleOtherDepartments">
          <text>展示本院区其他科室排班</text>
          <view
            class="appointment-mini-switch"
            :class="{ 'appointment-mini-switch--off': !showOtherDepartments }"
          />
        </view>

        <view
          v-if="showOtherDepartments"
          class="doctor-home-page__collapsed-list"
          :class="{ 'doctor-home-page__collapsed-list--enter': otherDepartmentsAnimating }"
        >
          <view
            v-for="dept in extraDepartments"
            :key="dept.id"
            class="doctor-home-page__schedule-panel"
            :class="{ 'is-active-card': shouldShowTimeSlotsForDept(dept.id) }"
          >
            <view class="doctor-home-page__dept-card doctor-home-page__dept-card--extra doctor-home-page__dept-card--expanded">
              <view class="doctor-home-page__dept-head">
                <text>{{ dept.name }}</text>
                <view class="doctor-home-page__dept-meta">
                  <view>
                    <text>诊查费</text>
                    <text>{{ dept.price }}</text>
                  </view>
                </view>
              </view>

              <view class="doctor-home-page__dept-slots">
                <view
                  v-for="slot in dept.slots"
                  :key="dept.id + slot.id"
                  class="doctor-home-page__dept-slot"
                  :class="{
                    'doctor-home-page__dept-slot--active': isSlotActive(slot.id),
                    'doctor-home-page__dept-slot--disabled': slot.full
                  }"
                  :hover-class="slot.full ? 'none' : 'doctor-home-page__dept-slot--hover'"
                  :hover-stay-time="150"
                  @tap="selectSlot(slot.id)"
                >
                  <text class="dept-slot-label">{{ formatSlotLabel(slot) }}</text>
                </view>
              </view>
            </view>

            <view
              class="doctor-home-page__collapsible-body"
              :class="{ 'doctor-home-page__collapsible-body--expanded': dept.remain > 0 && shouldShowTimeSlotsForDept(dept.id) }"
            >
              <view class="doctor-home-page__time-slots">
                <view
                  v-for="slot in dept.times"
                  :key="dept.id + slot.id"
                  class="doctor-home-page__time-slot"
                  :class="{
                    'doctor-home-page__time-slot--active': isTimeActive(slot.id),
                    'doctor-home-page__time-slot--disabled': slot.booked
                  }"
                  :hover-class="slot.booked ? 'none' : 'doctor-home-page__time-slot--hover'"
                  :hover-stay-time="150"
                  @tap="slot.booked ? handleBookedSlotClick() : (activeTimeId = slot.id)"
                >
                  <text class="time-slot-no">{{ slot.no }}</text>
                  <text class="time-slot-time">{{ slot.time }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <view v-else class="doctor-home-page__consult-content">
        <view class="doctor-home-page__consult-card">
          <view class="doctor-home-page__consult-head">
            <view class="doctor-home-page__consult-title-wrap">
              <text class="doctor-home-page__consult-title">{{ doctor.department }}门诊</text>
              <view class="doctor-home-page__consult-switch-btn" @tap="showConsultDeptPopup = true">
                <text>切换</text>
              </view>
            </view>
          </view>

          <view class="doctor-home-page__service-list">
            <button
              v-for="service in consultServices"
              :key="service.id"
              class="doctor-home-page__service-row"
              hover-class="doctor-home-page__service-row--hover"
              :hover-stay-time="150"
              @tap="handleConsultService(service.name)"
            >
              <view class="doctor-home-page__service-icon">
                <image :src="service.icon" mode="aspectFit" />
              </view>
              <view class="doctor-home-page__service-info">
                <text>{{ service.name }}</text>
                <text>{{ service.desc }}</text>
              </view>
              <view
                class="doctor-home-page__service-price"
                :class="'doctor-home-page__service-price--' + service.id"
              >
                <text>{{ service.price }}</text>
                <PortalRowArrow />
              </view>
            </button>
          </view>
        </view>

        <view
          class="doctor-home-page__expert-card"
          hover-class="doctor-home-page__expert-card--hover"
          :hover-stay-time="150"
          @tap="handleConsultService('专家团队')"
        >
          <view class="doctor-home-page__expert-avatar">
            <image src="https://foruda.gitee.com/images/1779939037698922393/695edf87_16918445.png" mode="aspectFill" />
          </view>
          <view class="doctor-home-page__expert-info">
            <text>专家团队</text>
            <text>多名医生提供线上问诊服务</text>
          </view>
          <view class="doctor-home-page__recommend">
            <text>推荐</text>
            <PortalRowArrow />
          </view>
        </view>
      </view>

      <view class="doctor-home-page__review-panel">
        <view class="doctor-home-page__review-title">
          <text>患者评价</text>
        </view>

        <view class="doctor-home-page__review-content">
          <view class="doctor-home-page__praise-list">
            <view
              v-for="item in praiseItems"
              :key="item.id"
              class="doctor-home-page__praise-row"
            >
              <view class="doctor-home-page__praise-left">
                <view class="doctor-home-page__praise-icon" :class="'doctor-home-page__praise-icon--' + item.id">
                  <image :src="item.icon" mode="aspectFit" />
                </view>
                <text>{{ item.name }}</text>
              </view>
              <view class="doctor-home-page__praise-count">
                <text>x</text>
                <text>{{ item.count }}</text>
              </view>
            </view>
          </view>

          <view class="doctor-home-page__review-tags">
            <view v-for="tag in reviewTags" :key="tag" class="doctor-home-page__review-tag">
              <text>{{ tag }}</text>
            </view>
          </view>

          <view class="doctor-home-page__review-list">
            <view v-for="item in reviews" :key="item.id" class="doctor-home-page__review-item">
              <view class="doctor-home-page__review-user">
                <view class="doctor-home-page__review-avatar">
                  <image :src="item.avatar" mode="aspectFill" />
                </view>
                <view>
                  <text>{{ item.name }}</text>
                  <text>{{ item.time }}</text>
                </view>
                <view class="doctor-home-page__review-stars">
                  <image
                    v-for="star in 5"
                    :key="item.id + star"
                    :src="starIcon"
                    mode="aspectFit"
                  />
                </view>
              </view>
              <text class="doctor-home-page__review-text">{{ item.text }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="activeMode === 'register'" class="doctor-home-page__fixed">
      <view class="doctor-home-page__fixed-info">
        <view>
          <text>预约时间</text>
          <text>{{ selectedAppointmentDate }}</text>
        </view>
        <view>
          <text>诊查费</text>
          <text>{{ doctor.consultPrice }}</text>
        </view>
      </view>
      <view class="doctor-home-page__submit" @tap="goConfirm">
        <text>立即预约</text>
      </view>
    </view>
    <PortalInspectionNoticePopup
      v-if="showIntroDialog"
      :title="dialogTitle"
      :items="dialogMessage"
      @confirm="showIntroDialog = false"
    />
    <PortalActionSheet
      v-model:show="showConsultDeptPopup"
      title="选择咨询科室"
      :actions="consultDeptActions"
      @select="handleSelectConsultDept"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useLoad, usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalRowArrow from '@/components/PortalRowArrow/index.vue'
import PortalInspectionNoticePopup from '@/components/PortalInspectionNoticePopup/index.vue'
import PortalActionSheet from '@/components/PortalActionSheet/index.vue'
import { getRouteUrl, getSafeMenuButtonBoundingClientRect } from '@/utils'
import { useAppStore } from '@/store'

const store = useAppStore()
import {
  campusTabs,
  dateTabs,
  doctors,
  routeMap,
  getDoctorDepartments as getDoctorDeptSchedule,
  generateDynamicTimeSlots,
  getSessionRemainingCount,
  createRandom
} from '../mock'
const aiAvatarIcon = 'https://foruda.gitee.com/images/1779963394718913883/f2fb58ae_16918445.png'
const bannerIcon = 'https://foruda.gitee.com/images/1779939024557221939/2fa4e9b9_16918445.png'
const praiseUserIcon = 'https://foruda.gitee.com/images/1779939010286249337/ce6ed5f4_16918445.png'
import '../common.less'
import './index.less'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
const contentTop = menuButtonInfo.bottom + 16

const scrollTop = ref(0)
const activeCampus = ref(campusTabs[0])
const activeMode = ref<'register' | 'consult'>('register')
const activeTimeId = ref('')
const selectedDateId = ref('05-27')
const activeSlot = ref(`${doctors[0]?.id || 'song-yuanlin'}-05-27-am`)

const displayedDateTabs = computed(() => dateTabs.filter(t => t.id !== 'all'))

function selectDate(dateId: string) {
  if (selectedDateId.value === dateId) return
  selectedDateId.value = dateId

  Taro.nextTick(() => {
    const firstAvailableSlot = departmentSlots.value.find(item => !item.full)
    const targetSlotId = firstAvailableSlot?.id || departmentSlots.value[0]?.id || ''
    if (targetSlotId) {
      activeSlot.value = targetSlotId
      autoSelectFirstTimeSlot(targetSlotId)
    }
  })
}

const activeDoctorId = ref(doctors[0]?.id || '')
const showOtherDepartments = computed({
  get: () => !!store.showOtherDeptsMap[activeDoctorId.value],
  set: (val) => {
    store.showOtherDeptsMap[activeDoctorId.value] = val
    store.saveToStorage()
  }
})
const otherDepartmentsAnimating = ref(false)
const customDeptName = ref('')
const doctor = computed(() => {
  const baseDoc = doctors.find(item => item.id === activeDoctorId.value) || doctors[0] || {}
  const deptName = customDeptName.value || baseDoc.clinic || baseDoc.department || '非病毒性肝病科'
  return {
    ...baseDoc,
    clinic: deptName,
    department: deptName
  }
})

const serviceTags = computed(() => {
  return doctor.value.gender === 'male' ? ['图文咨询', '视频问诊', '义诊咨询'] : ['图文咨询', '视频问诊']
})

const hasScheduleSwitch = computed(() => {
  const dept = customDeptName.value || doctor.value.clinic || doctor.value.department || '非病毒性肝病科'
  const dateId = selectedDateId.value

  let list = doctors.map(d => {
    return {
      ...d,
      department: dept,
      clinic: dept
    }
  })

  // Same remain filter as on Doctor List page (showOnlyAvailable = true)
  list = list.filter(d => d.remain > 0)

  if (dateId && dateId !== 'all') {
    const rng = createRandom(`${dept}-${dateId}`)
    const shuffled = rng.shuffle(list)
    const count = rng.nextInt(5, 8)
    list = shuffled.slice(0, count)
  }

  if (list.length === 0) return false

  const switchRng = createRandom(`${dept}-${dateId}-switch`)
  const indices = Array.from({ length: list.length }, (_, i) => i)
  const shuffledIndices = switchRng.shuffle(indices)
  const selectedIndices = shuffledIndices.slice(0, Math.min(3, list.length))
  const selectedIds = selectedIndices.map(index => list[index].id)

  return selectedIds.includes(activeDoctorId.value)
})

const isPrimaryCardActive = computed(() => {
  return shouldShowTimeSlotsForDept('classic')
})

function isSlotActive(slotId: string) {
  return activeSlot.value === slotId
}

function isTimeActive(timeId: string) {
  return activeTimeId.value === timeId
}

function getSlotDept(slotId: string): 'classic' | 'conditioning' | 'rehab' {
  if (!slotId) return 'classic'
  const prefix = doctor.value?.id ? `${doctor.value.id}-` : ''
  let cleanId = slotId
  if (prefix && slotId.startsWith(prefix)) {
    cleanId = slotId.slice(prefix.length)
  }
  if (cleanId.startsWith('conditioning') || cleanId.startsWith('xihong-cond')) {
    return 'conditioning'
  }
  if (cleanId.startsWith('rehab') || cleanId.startsWith('xihong-rehab')) {
    return 'rehab'
  }
  return 'classic'
}

function shouldShowTimeSlotsForDept(deptId: string) {
  return getSlotDept(activeSlot.value) === deptId
}

function formatSlotLabel(slot: any) {
  const isMorning = slot.time.includes('上午')
  const period = isMorning ? '上午' : '下午'

  if (slot.full || slot.price === '已约满') {
    return `${period}(已约满)`
  }

  const match = slot.price.match(/\d+/)
  const count = match ? match[0] : ''
  if (count) {
    return `${period}(剩余${count})`
  }

  return `${period}(${slot.price})`
}

function getSingleDateSlots(deptId: 'classic' | 'conditioning' | 'rehab') {
  const dateTab = dateTabs.find(t => t.id === selectedDateId.value)
  if (!dateTab) return []

  const dateStr = dateTab.date
  const weekStr = dateTab.week

  let deptPrefix = ''
  if (deptId === 'conditioning') {
    deptPrefix = 'conditioning-'
  } else if (deptId === 'rehab') {
    deptPrefix = 'rehab-'
  }

  const isXihong = activeCampus.value === '西洪院区'
  const campusPrefix = isXihong ? 'xihong-' : ''

  const amBaseId = `${campusPrefix}${deptPrefix}${dateStr}-am`
  const pmBaseId = `${campusPrefix}${deptPrefix}${dateStr}-pm`

  const amSlotId = `${doctor.value.id}-${amBaseId}`
  const pmSlotId = `${doctor.value.id}-${pmBaseId}`

  const amRemain = getSessionRemainingCount(doctor.value.id, activeCampus.value, deptId, dateStr, 'am')
  const pmRemain = getSessionRemainingCount(doctor.value.id, activeCampus.value, deptId, dateStr, 'pm')

  const morningSlot = {
    id: amSlotId,
    time: `${dateStr} ${weekStr} 上午`,
    price: amRemain === 0 ? '已约满' : `剩余${amRemain}`,
    full: amRemain === 0
  }

  const afternoonSlot = {
    id: pmSlotId,
    time: `${dateStr} ${weekStr} 下午`,
    price: pmRemain === 0 ? '已约满' : `剩余${pmRemain}`,
    full: pmRemain === 0
  }

  return [morningSlot, afternoonSlot]
}

const departmentSlots = computed(() => {
  return getSingleDateSlots('classic')
})

const extraDepartments = computed(() => {
  if (!hasScheduleSwitch.value) return []
  const isXihong = activeCampus.value === '西洪院区'
  const depts = getDoctorDeptSchedule(doctor.value, activeCampus.value)
  const condDept = depts.find(d => d.id === 'conditioning')
  const rehabDept = depts.find(d => d.id === 'rehab')

  const getSlotsRemain = (slotsList: any[]) => {
    const activeS = slotsList.find(item => item.id === activeSlot.value)
    if (activeS) {
      if (activeS.full || activeS.price === '已约满') return 0
      const match = activeS.price.match(/\d+/)
      return match ? parseInt(match[0], 10) : 0
    }
    const firstS = slotsList.find(item => !item.full) || slotsList[0]
    if (firstS) {
      if (firstS.full || firstS.price === '已约满') return 0
      const match = firstS.price.match(/\d+/)
      return match ? parseInt(match[0], 10) : 0
    }
    return 0
  }

  const resultList = []
  if (condDept) {
    const slots = getSingleDateSlots('conditioning')
    resultList.push({
      id: 'conditioning',
      name: condDept.name,
      price: '30元',
      remain: getSlotsRemain(slots),
      full: false,
      slots: slots,
      times: generateDynamicTimeSlots(activeSlot.value, isXihong, 'conditioning')
    })
  }
  if (rehabDept) {
    const slots = getSingleDateSlots('rehab')
    resultList.push({
      id: 'rehab',
      name: rehabDept.name,
      price: '40元',
      remain: getSlotsRemain(slots),
      full: false,
      slots: slots,
      times: generateDynamicTimeSlots(activeSlot.value, isXihong, 'rehab')
    })
  }
  return resultList
})

const timeSlots = computed(() => {
  const isXihong = activeCampus.value === '西洪院区'
  return generateDynamicTimeSlots(activeSlot.value, isXihong, 'classic')
})

const allScheduleSlots = computed(() => {
  return departmentSlots.value.concat(
    extraDepartments.value.reduce<any[]>((items, dept) => {
      return items.concat(dept.slots)
    }, [])
  )
})

const selectedAppointmentDate = computed(() => {
  const slot = allScheduleSlots.value.find(item => item.id === activeSlot.value)
  const timeSlot = timeSlots.value.find(item => item.id === activeTimeId.value)

  if (slot) {
    if (timeSlot) {
      return `${slot.time} ${timeSlot.time}`
    }
    return slot.time
  }
  return '05-27 周三 上午'
})

const consultServices = [
  {
    id: 'text',
    name: '图文问诊',
    desc: '不可开药，可使用图文/语音交流',
    price: '免费',
    icon: 'https://foruda.gitee.com/images/1779963782072007183/d2b0d8ad_16918445.png'
  },
  {
    id: 'video',
    name: '视频问诊',
    desc: '不可开药，可使用图文/语音交流',
    price: '¥50',
    icon: 'https://foruda.gitee.com/images/1779963815318681042/f701d488_16918445.png'
  },
  {
    id: 'charity',
    name: '义诊咨询',
    desc: '可开检查检验，可使用图文/视频交流',
    price: '免费',
    icon: 'https://foruda.gitee.com/images/1779963796997491803/1b20a20d_16918445.png'
  }
]

const praiseItems = [
  { id: 'banner', icon: bannerIcon, name: '电子锦旗', count: '11次' },
  { id: 'letter', icon: praiseUserIcon, name: '电子表扬信', count: '23次' }
]

const reviewTags = [
  '医术高超(42)',
  '态度温和(35)',
  '讲解清晰(28)',
  '非常专业(26)',
  '回复迅速(19)',
  '耐心细致(15)'
]

const reviews = [
  {
    id: 'r1',
    name: '孔*雯',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E6%88%90%E5%B9%B4%E5%A5%B3.png', // adultFemale
    time: '2026-05-27  10:24:18',
    text: '宋医生看病非常仔细，态度特别温和。耐心地解答了我所有关于慢性肝病管理的问题，给出的调理方案非常清晰，吃了一周药感觉好多了！'
  },
  {
    id: 'r2',
    name: '王*山',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E8%80%81%E5%B9%B4%E7%94%B7.png', // elderlyMale
    time: '2026-05-25  14:32:05',
    text: '非常专业的专家！针对长期脂肪肝调理讲得很透彻，详细交代了日常饮食禁忌和作息注意事项。线上图文问诊很方便，回复及时！'
  },
  {
    id: 'r3',
    name: '刘*英',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E8%80%81%E5%B9%B4%E5%A5%B3.png', // elderlyFemale
    time: '2026-05-20  09:15:44',
    text: '线上沟通很顺畅，医生问诊很仔细。处方用药温和，吃了几天指标明显改善。解答很专业，省去了跑医院排队的时间，非常满意！'
  },
  {
    id: 'r4',
    name: '陈*明',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E6%88%90%E5%B9%B4%E7%94%B7.png', // adultMale
    time: '2026-05-18  16:45:30',
    text: '非常感谢宋主任！百忙之中还能这么快回复，不仅给出了权威的诊断，还安慰我不要过度焦虑，调整作息配合中药，现在身体感觉轻松多了。'
  },
  {
    id: 'r5',
    name: '张*杰',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E5%84%BF%E7%AB%A5%E7%94%B7.png', // childMale
    time: '2026-05-15  11:20:12',
    text: '带孩子线上复诊，医生特别有耐心。态度亲切，讲解细致，针对小孩的调理用药给出了非常合理的剂量微调，打消了我们家属的很多顾虑。'
  },
  {
    id: 'r6',
    name: '李*燕',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E5%84%BF%E7%AB%A5%E5%A5%B3.png', // childFemale
    time: '2026-05-12  08:50:55',
    text: '大夫看病十分认真。不仅医术高超，医德也十分高尚。线上复诊很准时，回复问题有条不紊，讲解生动易懂，太赞了！'
  },
  {
    id: 'r7',
    name: '赵*华',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E8%80%81%E5%B9%B4%E7%94%B7.png', // elderlyMale
    time: '2026-05-10  15:10:04',
    text: '医生非常有责任心。我年龄大打字慢，医生特意发语音详细说明吃药的顺序和注意事项，像家里人一样亲切，药方吃着效果也非常好。'
  },
  {
    id: 'r8',
    name: '周*倩',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E6%88%90%E5%B9%B4%E5%A5%B3.png', // adultFemale
    time: '2026-05-08  14:05:22',
    text: '真的是非常有耐心的好大夫！对患者的提问总能第一时间回复，解答专业到位，非常细致。开的方子调理脾胃和肝胆，效果特别好！'
  },
  {
    id: 'r9',
    name: '林*辉',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E6%88%90%E5%B9%B4%E7%94%B7.png', // adultMale
    time: '2026-05-05  10:30:18',
    text: '宋主任医术精湛，经验丰富！慢病调理非常注重整体平衡，感觉身体的抵抗力也提高了不少。线上就医太便利了，强烈推荐！'
  },
  {
    id: 'r10',
    name: '徐*芳',
    avatar: 'https://mh3-1329061729.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%9B%BE/%E9%97%A8%E6%88%B73.0%E5%88%87%E5%9B%BE%E8%B5%84%E6%BA%90/USER/Property%201%3D%E8%80%81%E5%B9%B4%E5%A5%B3.png', // elderlyFemale
    time: '2026-05-02  13:18:40',
    text: '非常满意的一次线上问诊。医生服务态度超好，对于老人的老毛病调理很有一套，每次开方子都会做详细的调整，是值得信赖的家庭好医生。'
  }
]

useLoad((query: Record<string, string | undefined>) => {
  store.syncFromStorage()
  const mode = query.mode ? decodeURIComponent(query.mode) : ''
  activeMode.value = mode === 'consult' ? 'consult' : 'register'

  if (query.dateId && query.dateId !== 'all') {
    try {
      selectedDateId.value = decodeURIComponent(query.dateId)
    } catch (e) {
      selectedDateId.value = query.dateId
    }
  } else {
    selectedDateId.value = dateTabs.find(t => t.id !== 'all')?.id || '05-26'
  }

  if (query.deptName) {
    try {
      customDeptName.value = decodeURIComponent(query.deptName)
    } catch (e) {
      customDeptName.value = query.deptName
    }
  } else {
    customDeptName.value = ''
  }

  let reqDoctorId = ''
  if (query.doctorId) {
    try {
      reqDoctorId = decodeURIComponent(query.doctorId)
    } catch (e) {
      reqDoctorId = query.doctorId
    }
  }
  if (reqDoctorId && doctors.some(item => item.id === reqDoctorId)) {
    activeDoctorId.value = reqDoctorId
  }

  if (query.campus) {
    try {
      const decodedCampus = decodeURIComponent(query.campus)
      if (campusTabs.includes(decodedCampus)) {
        activeCampus.value = decodedCampus
      }
    } catch (e) {
      if (campusTabs.includes(query.campus)) {
        activeCampus.value = query.campus
      }
    }
  } else {
    // Default to doctor's configured campus if not provided in query
    const doc = doctors.find(item => item.id === activeDoctorId.value)
    if (doc && doc.campus) {
      activeCampus.value = doc.campus
    } else {
      activeCampus.value = campusTabs[0]
    }
  }

  let reqSlotId = ''
  if (query.slotId) {
    try {
      reqSlotId = decodeURIComponent(query.slotId)
    } catch (e) {
      reqSlotId = query.slotId
    }
  }

  if (reqSlotId && allScheduleSlots.value.some(item => item.id === reqSlotId && !item.full)) {
    activeSlot.value = reqSlotId
  } else {
    // Automatically select the first available slot for this doctor & campus
    const firstAvailableSlot = departmentSlots.value.find(item => !item.full)
    if (firstAvailableSlot) {
      activeSlot.value = firstAvailableSlot.id
    } else {
      activeSlot.value = departmentSlots.value[0]?.id || ''
    }
  }

  let reqDeptId = ''
  if (query.departmentId) {
    try {
      reqDeptId = decodeURIComponent(query.departmentId)
    } catch (e) {
      reqDeptId = query.departmentId
    }
  }
  if (reqDeptId && reqDeptId !== 'classic') {
    showOtherDepartments.value = true
  }

  autoSelectFirstTimeSlot(activeSlot.value)

  if (reqSlotId || reqDeptId) {
    scrollToActiveSlot()
  }
})

usePageScroll(({ scrollTop: pageScrollTop }) => {
  scrollTop.value = pageScrollTop
})

function selectSlot(id: string) {
  const slot = allScheduleSlots.value.find(item => item.id === id)
  if (slot?.full) {
    Taro.showToast({
      title: '该号源已约满',
      icon: 'none'
    })
    return
  }

  activeSlot.value = id
  autoSelectFirstTimeSlot(id)
  scrollToActiveSlot()
}

function scrollToActiveSlot() {
  setTimeout(() => {
    const query = Taro.createSelectorQuery()
    query.select('.is-active-card').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res && res[0] && res[1]) {
        const cardRect = res[0]
        const scrollInfo = res[1]
        const systemInfo = Taro.getSystemInfoSync()
        const windowHeight = systemInfo.windowHeight
        const navHeight = menuButtonInfo.bottom + 8 // top nav height

        const visibleHeight = windowHeight - navHeight
        const cardHeight = cardRect.height
        const absoluteTop = cardRect.top + scrollInfo.scrollTop

        let targetScrollTop = absoluteTop - navHeight
        if (visibleHeight > cardHeight) {
          // Center the card vertically in the remaining space below the navigation bar
          targetScrollTop = absoluteTop - navHeight - (visibleHeight - cardHeight) / 2
        }

        Taro.pageScrollTo({
          scrollTop: Math.max(0, targetScrollTop),
          duration: 300
        })
      } else {
        Taro.pageScrollTo({
          selector: '.is-active-card',
          duration: 300,
          offsetTop: -90
        })
      }
    })
  }, 120)
}

function autoSelectFirstTimeSlot(slotId: string) {
  let currentTimes: any[] = []
  const dept = getSlotDept(slotId)
  if (dept === 'conditioning') {
    const d = extraDepartments.value.find(x => x.id === 'conditioning')
    if (d) currentTimes = d.times
  } else if (dept === 'rehab') {
    const d = extraDepartments.value.find(x => x.id === 'rehab')
    if (d) currentTimes = d.times
  } else {
    currentTimes = timeSlots.value
  }
  const firstAvailable = currentTimes.find(t => !t.booked)
  if (firstAvailable) {
    activeTimeId.value = firstAvailable.id
  } else {
    activeTimeId.value = ''
  }
}

function handleBookedSlotClick() {
  Taro.showToast({
    title: '该号源已被预约',
    icon: 'none'
  })
}

function toggleOtherDepartments() {
  showOtherDepartments.value = !showOtherDepartments.value

  if (showOtherDepartments.value) {
    otherDepartmentsAnimating.value = true
    setTimeout(() => {
      otherDepartmentsAnimating.value = false
    }, 220)
    return
  }

  const selectedInCurrentDepartment = departmentSlots.value.some(item => item.id === activeSlot.value)
  if (!selectedInCurrentDepartment) {
    const firstAvailableSlot = departmentSlots.value.find(item => !item.full)
    const targetSlotId = firstAvailableSlot?.id || '05-27-am'
    selectSlot(targetSlotId)
  }
}

const showConsultDeptPopup = ref(false)

const consultDeptActions = computed(() => {
  const depts = getDoctorDeptSchedule(doctor.value, activeCampus.value)
  return depts.map(d => d.name)
})

function handleConsultService(name: string) {
  const service = consultServices.find(item => item.name === name)
  if (!service) {
    Taro.showToast({
      title: '功能暂未开放',
      icon: 'none'
    })
    return
  }

  const query = [
    `doctorId=${encodeURIComponent(activeDoctorId.value)}`,
    `deptName=${encodeURIComponent(doctor.value.clinic || doctor.value.department || '')}`,
    `serviceName=${encodeURIComponent(service.name)}`,
    `servicePrice=${encodeURIComponent(service.price)}`,
    `dateId=${encodeURIComponent(selectedDateId.value)}`
  ].join('&')

  Taro.navigateTo({
    url: `/pages/common-list/online-followup/index?${query}`,
    fail(err) {
      console.error('navigateTo followup index failed, pages:', getCurrentPages().length, err)
    }
  })
}

function handleSelectConsultDept(deptName: string) {
  customDeptName.value = deptName
  showConsultDeptPopup.value = false
}

function showFeatureNotAvailable() {
  Taro.showToast({
    title: '该功能暂未开放',
    icon: 'none'
  })
}

const followedDoctorIds = ref<string[]>([])

function isDoctorFollowed(doctorId: string) {
  return followedDoctorIds.value.includes(doctorId)
}

function toggleFollow(doctorId: string) {
  const doc = doctors.find(d => d.id === doctorId)
  if (isDoctorFollowed(doctorId)) {
    followedDoctorIds.value = followedDoctorIds.value.filter(id => id !== doctorId)
    if (doc) {
      doc.follows = String(Number(doc.follows) - 1)
    }
    Taro.showToast({
      title: '已取消关注',
      icon: 'none'
    })
    return
  }

  followedDoctorIds.value = followedDoctorIds.value.concat(doctorId)
  if (doc) {
    doc.follows = String(Number(doc.follows) + 1)
  }
  Taro.showToast({
    title: '已关注',
    icon: 'success'
  })
}

function goConfirm() {
  const query = [
    `doctorId=${encodeURIComponent(activeDoctorId.value)}`,
    `campus=${encodeURIComponent(activeCampus.value)}`,
    `slotId=${encodeURIComponent(activeSlot.value)}`,
    `timeId=${encodeURIComponent(activeTimeId.value)}`,
    `deptName=${encodeURIComponent(doctor.value.clinic)}`
  ].join('&')
  Taro.navigateTo({ url: getRouteUrl(`${routeMap.confirm}?${query}`) })
}

const showIntroDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref<string[]>([])

function showDoctorIntro(doc: typeof doctors[number]) {
  dialogTitle.value = `${doc.name} 详细介绍`
  if (doc.id === 'song-yuanlin') {
    dialogMessage.value = [
      '宋医生，主任医师，医学博士，博导。现任门急诊部主任，脂肪肝慢病健康管理中心学术带头人。从事中医及中西医结合临床与研究工作三十余年，具有极其丰富的临床诊疗经验。',
      '他擅长运用中医经典理论辨证施治，尤其在<strong>慢性肝病诊疗</strong>、<strong>肝功能异常</strong>、<strong>调理各类肝炎诊治</strong>及其并发症的中医药防治方面造诣深厚。',
      '宋医生主张“防治并重、综合调理”的健康管理理念，强调通过调节人体脏腑功能以达到扶正祛邪的效果。他曾主持并参与多项国家级及省部级科研课题，在国内外核心期刊发表学术论文四十余篇，并在业内享有极高的学术声誉与患者口碑。他治学严谨，对待患者耐心细致，深受广大患者的信赖与好评。'
    ]
  } else if (doc.id === 'recent-zhang') {
    dialogMessage.value = [
      '张医生，主任医师，教授，医学硕士，现任皮肤科核心专家。从事皮肤科临床工作十余年，在色素性皮肤病、湿疹、荨麻疹及皮肤屏障修复领域积累了极其丰富的临床经验。',
      '在学术上，她擅长针对<strong>面部皮炎诊疗</strong>、<strong>湿疹荨麻疹</strong>、<strong>皮肤抗衰管理</strong>等进行系统性中西医结合调理与治疗，取得了显著的临床疗效。',
      '张医生特别关注皮肤慢病患者的长期健康管理，倡导“内外兼治”与“科学护肤”的综合干预模式，为患者量身定制护肤、饮食和生活作息的多维度方案。'
    ]
  } else if (doc.id === 'recent-li') {
    dialogMessage.value = [
      '李医生，副主任医师，医学硕士，现任重症肝病科核心专家。从事肝胆外科临床与慢病健康管理工作十五年，擅长各类肝胆胰腺系统疾病的微创手术及综合诊疗。',
      '在学术上，他擅长针对<strong>肝胆肿瘤微创</strong>、<strong>胆囊结石诊治</strong>、<strong>脂肪肝慢病调理</strong>等进行系统性诊疗，取得了显著的临床疗效。',
      '李医生推崇以患者为中心的多学科综合诊疗模式，特别关注重症肝病患者的术后康复与长期随访调理，积累了极佳的患者口碑。'
    ]
  } else {
    const name = doc.name || '医生'
    const title = doc.title || '医师'
    const genderWord = doc.gender === 'female' ? '她' : '他'
    const dept = doc.clinic || doc.department || '本科室'
    const tags = doc.tags && doc.tags.length > 0 ? doc.tags : ['临床诊疗', '健康管理', '慢病调理']
    const tagListHtml = tags.map((t: string) => `<strong>${t}</strong>`).join('、')

    dialogMessage.value = [
      `${name}，${title}，现任本专科核心专家。从事${dept}及慢病健康管理临床工作多年，具有极其丰富的临床诊疗与实践经验。${genderWord}深研临床医学，主张“以患者为中心”的施治原则。`,
      `在学术与临床上，${genderWord}擅长针对${tagListHtml}等进行系统性调理与治疗，取得了显著的疗效。`,
      `${name}医生特别关注患者的长期健康管理，倡导“防重于治”与“身心共治”的综合干预模式，根据患者体质提供饮食、运动和日常调养的多维度方案。${genderWord}治学严谨，对待患者耐心细致，深受广大患者的信赖与好评。`
    ]
  }
  showIntroDialog.value = true
}
</script>
